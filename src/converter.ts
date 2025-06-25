import sharp from 'sharp';
import PDFDocument from 'pdfkit';
import { promises as fs } from 'fs';
import { createWriteStream } from 'fs';
import * as path from 'path';
import * as readline from 'readline';

interface ConverterOptions {
  verbose?: boolean;
  interactive?: boolean;
}

interface ImageInfo {
  path: string;
  width: number;
  height: number;
  shouldRotate: boolean;
}

export class PngToPdfConverter {
  private options: ConverterOptions;

  constructor(options: ConverterOptions = {}) {
    this.options = options;
  }

  async convert(inputPath: string, outputPath: string, rotatePages?: string): Promise<void> {
    const pngFiles = await this.findPngFiles(inputPath);
    
    if (pngFiles.length === 0) {
      throw new Error('No PNG files found in the specified path');
    }

    this.log(`Found ${pngFiles.length} PNG files`);

    const rotateSet = this.parseRotatePages(rotatePages);
    const imageInfos = await this.loadImageInfo(pngFiles, rotateSet);

    await this.createPdf(imageInfos, outputPath);
  }

  private async findPngFiles(inputPath: string): Promise<string[]> {
    const stats = await fs.stat(inputPath).catch(() => null);
    
    if (stats && stats.isDirectory()) {
      const files = await fs.readdir(inputPath);
      const pngFiles = files
        .filter(file => file.toLowerCase().endsWith('.png'))
        .map(file => path.join(inputPath, file));
      
      return this.naturalSort(pngFiles);
    } else if (stats && stats.isFile() && inputPath.toLowerCase().endsWith('.png')) {
      return [inputPath];
    } else {
      throw new Error('Invalid input path. Please provide a directory or PNG file.');
    }
  }

  private naturalSort(files: string[]): string[] {
    return files.sort((a, b) => {
      const aName = path.basename(a);
      const bName = path.basename(b);
      
      const aParts = aName.match(/(\d+|\D+)/g) || [];
      const bParts = bName.match(/(\d+|\D+)/g) || [];
      
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || '';
        const bPart = bParts[i] || '';
        
        const aNum = parseInt(aPart, 10);
        const bNum = parseInt(bPart, 10);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          if (aNum !== bNum) return aNum - bNum;
        } else {
          if (aPart !== bPart) return aPart.localeCompare(bPart);
        }
      }
      
      return 0;
    });
  }

  private parseRotatePages(rotatePages?: string): Set<number> {
    const rotateSet = new Set<number>();
    
    if (!rotatePages) return rotateSet;
    
    const parts = rotatePages.split(',');
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
        for (let i = start; i <= end; i++) {
          rotateSet.add(i - 1); // Convert to 0-based index
        }
      } else {
        rotateSet.add(parseInt(part.trim(), 10) - 1); // Convert to 0-based index
      }
    }
    
    return rotateSet;
  }

  private async loadImageInfo(files: string[], rotateSet: Set<number>): Promise<ImageInfo[]> {
    const imageInfos: ImageInfo[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.log(`Processing ${path.basename(file)}...`);
      
      const metadata = await sharp(file).metadata();
      
      if (!metadata.width || !metadata.height) {
        throw new Error(`Could not read dimensions for ${file}`);
      }
      
      let shouldRotate = rotateSet.has(i);
      
      if (this.options.interactive) {
        shouldRotate = await this.promptForRotation(file, i + 1, metadata.width > metadata.height);
      }
      
      imageInfos.push({
        path: file,
        width: metadata.width,
        height: metadata.height,
        shouldRotate
      });
    }
    
    return imageInfos;
  }

  private async promptForRotation(file: string, pageNum: number, isLandscape: boolean): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const orientation = isLandscape ? 'landscape' : 'portrait';
    const question = `Page ${pageNum} (${path.basename(file)}) is currently ${orientation}. Rotate 90°? (y/N): `;
    
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'y');
      });
    });
  }

  private async createPdf(imageInfos: ImageInfo[], outputPath: string): Promise<void> {
    const doc = new PDFDocument({ autoFirstPage: false });
    const stream = doc.pipe(createWriteStream(outputPath));
    
    for (const imageInfo of imageInfos) {
      this.log(`Adding ${path.basename(imageInfo.path)} to PDF...`);
      
      let buffer = await fs.readFile(imageInfo.path);
      let width = imageInfo.width;
      let height = imageInfo.height;
      
      if (imageInfo.shouldRotate) {
        const rotated = await sharp(buffer).rotate(90).toBuffer();
        buffer = rotated;
        // Swap dimensions after rotation
        [width, height] = [height, width];
      }
      
      // Add page with dimensions matching the image
      doc.addPage({ size: [width, height] });
      doc.image(buffer, 0, 0, { width, height });
    }
    
    doc.end();
    await new Promise<void>((resolve, reject) => {
      stream.on('finish', () => resolve());
      stream.on('error', reject);
    });
  }

  private log(message: string): void {
    if (this.options.verbose) {
      console.log(message);
    }
  }
}