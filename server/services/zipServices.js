const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Creates zip from a folder
 * @param {String} sourceDir - folder to zip
 * @param {String} outPath - zip file path
 */
function zipProject(sourceDir, outPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => {
            resolve(outPath);
        });

        archive.on('error', (err) => {
            reject(err);
        });
        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
    });
}

module.exports = zipProject;