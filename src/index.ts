#!/usr/bin/env node

import { Command } from 'commander';
import { PngToPdfConverter } from './converter';
import { promises as fs } from 'fs';
import * as path from 'path';

const program = new Command();

program
  .name('png-to-pdf')
  .description('Convert a series of PNG images to a PDF document')
  .version('1.0.0')
  .argument('<input>', 'Input directory containing PNG files or glob pattern')
  .option('-o, --output <path>', 'Output PDF file path')
  .option('-i, --interactive', 'Interactive mode to set orientation for each image')
  .option('-r, --rotate <pages>', 'Rotate specific pages (e.g., "1,3,5-7")')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (input, options) => {
    try {
      // Determine output path
      let outputPath = options.output;
      if (!outputPath) {
        const stats = await fs.stat(input);
        if (stats.isDirectory()) {
          outputPath = path.join(input, 'output.pdf');
        } else {
          outputPath = path.join(path.dirname(input), 'output.pdf');
        }
      }

      const converter = new PngToPdfConverter({
        verbose: options.verbose,
        interactive: options.interactive
      });

      await converter.convert(input, outputPath, options.rotate);
      
      console.log(`✅ PDF created successfully: ${outputPath}`);
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();