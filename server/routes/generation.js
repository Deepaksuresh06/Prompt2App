const express = require('express');
const router = express.Router();
const Generation = require('../models/GenerationModel');
const User = require('../models/UserModel');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const processGeneration = require('../services/generationWorker');

// =======================================
// Create new generation request
// =======================================
router.post('/generate', async (req, res) => { 
    try {
        const { userId, prompt, stack } = req.body;
        if (!userId || !prompt || !stack) {
            return res.status(400).json({
                message: 'userId, prompt and stack are required'
            });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'Invalid userId format'
            });
        }
        if (prompt.trim().length === 0) {
            return res.status(400).json({
                message: 'Prompt cannot be empty'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const generation = await Generation.create({
            user: userId,
            prompt,
            stack,
            status: 'pending'
        });
        processGeneration(generation._id, prompt, stack);

        return res.status(201).json({
            message: 'Generation started',
            data: {
                id: generation._id,
                status: generation.status
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Failed to create generation',
            error: error.message
        });
    }
});

// =======================================
// Get generation details + status
// =======================================
router.get('/generate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid generation ID'
            });
        }

        const generation = await Generation
            .findById(id)
            .populate('user', 'username email');

        if (!generation) {
            return res.status(404).json({
                message: 'Generation not found'
            });
        }

        return res.status(200).json({
            message: 'Generation fetched successfully',
            data: generation
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch generation',
            error: error.message
        });
    }
});

// =======================================
// Download generated zip archive
// =======================================
router.get('/generate/:id/download', async (req, res) => {
    try {
        const { id } = req.params;

        const generation = await Generation.findById(id);

        if (!generation) {
            return res.status(404).json({
                message: 'Generation not found'
            });
        }

        if (generation.status !== 'completed') {
            return res.status(400).json({
                message: 'Generation not completed yet'
            });
        }

        if (!generation.archivePath) {
            return res.status(400).json({
                message: 'No file available'
            });
        }

        const filePath = path.resolve(generation.archivePath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                message: 'File not found on server'
            });
        }

        res.download(filePath, `project-${id}.zip`);

    } catch (error) {
        res.status(500).json({
            message: 'Download failed',
            error: error.message
        });
    }
});

// =======================================
// Get generation history of a user
// =======================================
router.get('/generate/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        const generations = await Generation
            .find({ user: userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Generation history fetched',
            data: generations
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch history',
            error: error.message
        });
    }
});


// =======================================
// Delete generation record
// =======================================
router.delete('/generate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid generation ID'
            });
        }

        const generation = await Generation.findById(id);
        if (!generation) {
            return res.status(404).json({
                message: 'Generation not found'
            });
        }
        // Optional: delete archive file too
        if (generation.archivePath && fs.existsSync(generation.archivePath)) {
            fs.unlinkSync(generation.archivePath);
        }
        
        await Generation.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Generation deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Failed to delete generation',
            error: error.message
        });
    }
});


module.exports = router;