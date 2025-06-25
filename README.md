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

Convert all PNGs in a directory to PDF (saves to same directory):
```bash
npm start -- ./images
```

Specify custom output location:
```bash
npm start -- ./images -o /path/to/output.pdf
```

### Interactive Mode

Set orientation for each image interactively:
```bash
npm start -- ./images -i
```

### Rotate Specific Pages

Rotate specific pages by page number:
```bash
npm start -- ./images -r "1,3,5-7"
```

This rotates pages 1, 3, 5, 6, and 7 by 90 degrees.

### Options

- `-o, --output <path>`: Output PDF file path (default: saves to input directory as output.pdf)
- `-i, --interactive`: Interactive mode to set orientation for each image
- `-r, --rotate <pages>`: Rotate specific pages (e.g., "1,3,5-7")
- `-v, --verbose`: Enable verbose logging

## Examples

1. Convert all PNGs in current directory:
   ```bash
   npm start -- .
   ```

2. Convert with specific rotations and custom output:
   ```bash
   npm start -- ./screenshots -r "2,4,6" -o ~/Desktop/rotated.pdf
   ```

3. Interactive mode with verbose output:
   ```bash
   npm start -- ./photos -i -v
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

## Packaging

The application can be packaged as a standalone executable:

```bash
# Install dependencies (including pkg)
npm install

# Create standalone executables for multiple platforms
npm run package
```

This will create standalone executables in the `dist` directory for:
- macOS (x64): `dist/pdf-stitcher-macos`
- Linux (x64): `dist/pdf-stitcher-linux`
- Windows (x64): `dist/pdf-stitcher-win.exe`

### Shell Script Wrapper

A shell script wrapper `pdf-stitcher.sh` is included for easier command-line usage:

```bash
# Make the script executable
chmod +x pdf-stitcher.sh

# Use the wrapper script
./pdf-stitcher.sh ./images -o output.pdf
```

### Global Installation

To install the tool globally on your system:

```bash
# Build the project first
npm run build

# Install globally
npm install -g .

# Now you can use it from anywhere
pdf-stitcher ./images -o output.pdf
```