const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  trainerId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  googleDriveFolderId: { 
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Trainer', TrainerSchema);