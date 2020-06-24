const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
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
  },
  author: {
    type: 'ObjectId',
    ref: 'User',
    required: true
  },
  users: [{
    type: 'ObjectId',
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    required: true
  }
});


module.exports = mongoose.model('Course', CourseSchema);