const fs = require('fs');
const path = require('path');

/**
 * Creates project files from AI output
 * @param {Object} aiOutput - Parsed AI JSON
 * @param {String} baseDir - Base directory to create project
 */
async function writeFiles(aiOutput, baseDir) {
    try {
        if (!aiOutput || !aiOutput.files) {
            throw new Error('Invalid AI output format');
        }    

        // Create base directory
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
        }
        
        for (const file of aiOutput.files) {
            const filePath = path.join(baseDir, file.path);

            // Ensure directory exists
            const dir = path.dirname(filePath);
            fs.mkdirSync(dir, { recursive: true });

            // Write file content
            fs.writeFileSync(filePath, file.content, 'utf8');
        }
        return baseDir;

    } catch (error) {
        throw new Error(`FileWriter Error: ${error.message}`);
    }
}

module.exports = writeFiles;