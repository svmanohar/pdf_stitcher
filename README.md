# PNG to PDF Converter

A command-line tool that converts a series of PNG images into a single PDF document, with support for image rotation and natural file ordering.

## Features

- Converts multiple PNG files to a single PDF
- Natural sorting of filenames (1.png, 2.png, ..., 10.png, not 1.png, 10.png, 2.png)
- Rotate individual pages between portrait and landscape orientation
- Interactive mode for setting orientation per image
- Preserves image quality
- Each PNG becomes a single page in the PDF

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Usage

Convert all PNGs in a directory to PDF:
```bash
npm start ./images -o output.pdf
```

### Interactive Mode

Set orientation for each image interactively:
```bash
npm start ./images -i -o output.pdf
```

### Rotate Specific Pages

Rotate specific pages by page number:
```bash
npm start ./images -r "1,3,5-7" -o output.pdf
```

This rotates pages 1, 3, 5, 6, and 7 by 90 degrees.

### Options

- `-o, --output <path>`: Output PDF file path (default: output.pdf)
- `-i, --interactive`: Interactive mode to set orientation for each image
- `-r, --rotate <pages>`: Rotate specific pages (e.g., "1,3,5-7")
- `-v, --verbose`: Enable verbose logging

## Examples

1. Convert all PNGs in current directory:
   ```bash
   npm start . -o my-document.pdf
   ```

2. Convert with specific rotations:
   ```bash
   npm start ./screenshots -r "2,4,6" -o rotated.pdf
   ```

3. Interactive mode with verbose output:
   ```bash
   npm start ./photos -i -v -o album.pdf
   ```

## Development

```bash
# Run in development mode
npm run dev ./images -o test.pdf

# Build TypeScript
npm run build

# Run compiled version
node dist/index.js ./images -o output.pdf
```