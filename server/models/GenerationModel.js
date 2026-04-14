const mongoose = require('mongoose');

const GenerationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    stack: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    archivePath: {
      type: String,
      default: null,
    },
    aiOutput: {
      type: String,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  }, { timestamps: true }
);

module.exports = mongoose.model('Generation', GenerationSchema);