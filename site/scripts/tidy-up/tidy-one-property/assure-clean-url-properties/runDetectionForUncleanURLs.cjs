const path = require('path');
const { processDirectory } = require('/Users/mpstaton/code/lossless/202503_lossless-public/site/scripts/tidy-up/tidy-one-property/tidyOneAtaTimeUtils.cjs');

/**
 * Run a full directory scan for URL property validation
 * 
 * Called by:
 * 1. Command line from project root: node site/scripts/tidy-up/tidy-one-property/assure-clean-url-properties/test-url-detection.cjs
 */
async function runFullScan() {
    const toolingDir = '/Users/mpstaton/code/lossless/202503_lossless-public/site/src/content/tooling';
    console.log('Scanning directory:', toolingDir);
    await processDirectory(toolingDir);
}

runFullScan();
