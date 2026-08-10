const path = require('path');
const fs = require('fs');

const Generation = require('../models/GenerationModel');
const generateCodeWithAI = require('./aiServices');
const writeFiles = require('./fileWriter');
const zipProject = require('./zipServices');

async function processGeneration(id, prompt, stack) {
    try {
        // Step 1: mark processing
        await Generation.findByIdAndUpdate(id, {
            status: 'processing'
        });

        // Step 2: call AI
        const aiResult = await generateCodeWithAI(prompt, stack);

        // Step 3: create project folder
        const projectDir = path.join(__dirname, `../generated/${id}`);
        await writeFiles(aiResult, projectDir);

        // Step 4: zip project
        const zipPath = path.join(__dirname, `../generated/${id}.zip`);
        await zipProject(projectDir, zipPath);

        // Step 5: update DB
        await Generation.findByIdAndUpdate(id, {
            status: 'completed',
            aiOutput: JSON.stringify(aiResult),
            archivePath: zipPath
        });

    } catch (error) {
        await Generation.findByIdAndUpdate(id, {
            status: 'failed',
            errorMessage: error.message
        });
    }
}

module.exports = processGeneration;