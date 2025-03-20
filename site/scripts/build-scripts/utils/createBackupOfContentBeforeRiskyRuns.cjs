const fs = require('fs');

/**
 * Creates a backup of a file by copying it with a .bak extension
 * @param {string} filePath - Absolute path to the file to backup
 * @param {boolean} verbose - If true, logs when backups are created
 * @returns {string} Path to the backup file
 */
function createBackup(filePath, verbose = false) {
    const backupPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, backupPath);
    if (verbose) {
        console.log(`Created backup: ${backupPath}`);
    }
    return backupPath;
}

module.exports = {
    createBackup
};