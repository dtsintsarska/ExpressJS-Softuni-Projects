const mongoose = require('mongoose');

const PlaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 50
  },
  imageUrl: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  creator: {
    type: 'ObjectId',
    ref: 'User',
  },
  likes: [{
    type: 'ObjectId',
    ref: 'User',
  }],
  createdAt: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('Play', PlaySchema);