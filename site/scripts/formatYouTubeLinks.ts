#!/usr/bin/env node

/**
 * Script to find and format YouTube links in markdown files
 * 
 * This script scans markdown files for youtu.be links that are not already
 * properly formatted, and surrounds them with the appropriate iframe code.
 */

import { processMarkdownFiles } from './cleanYouTubeLinks';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    console.log('Starting YouTube link formatting process...');
    
    // Default pattern for markdown files
    const defaultPattern = 'site/src/content/**/*.md';
    
    // Allow custom pattern from command line
    const customPattern = process.argv[2];
    const pattern = customPattern || defaultPattern;
    
    console.log(`Using glob pattern: ${pattern}`);
    
    // Process the markdown files
    await processMarkdownFiles(pattern);
    
    console.log('YouTube link formatting completed successfully');
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
}

// Run the script
main(); 