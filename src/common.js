const fs = require('fs');
const fse = require('fs-extra');

module.exports = {
    cliRootPath: __dirname.substring(0, __dirname.length - 3),
    readFileData
}

/**
 * Retrieves content of given file
 * @param {string} filePath Target file path
 * @returns {string | null} String representation of file content or null if file was not found
 */
function readFileData(filePath) {
    if (!fs.statSync(filePath).isDirectory()) {
        if (!fse.existsSync(filePath)) {
            return null;
        }

        return fse.readFileSync(filePath, 'utf8');
    }

    return null;
}