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
  .option('-o, --output <path>', 'Output PDF file path', 'output.pdf')
  .option('-i, --interactive', 'Interactive mode to set orientation for each image')
  .option('-r, --rotate <pages>', 'Rotate specific pages (e.g., "1,3,5-7")')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (input, options) => {
    try {
      const converter = new PngToPdfConverter({
        verbose: options.verbose,
        interactive: options.interactive
      });

      await converter.convert(input, options.output, options.rotate);
      
      console.log(`✅ PDF created successfully: ${options.output}`);
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();