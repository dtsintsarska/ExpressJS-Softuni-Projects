const mongoose = require('mongoose');

const TrippSchema = new mongoose.Schema({
  startPoint: {
    type: String,
    required: true,
  },
  endPoint: {
    type: String,
    required: true,
  },
  carImage: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  driver: {
    type: 'ObjectId',
    ref: 'User',
    required: true
  },
  buddies: [{
    type: 'ObjectId',
    ref: 'User',
  }],
  description: {
    type: String,
    required: true
  },
  seats: {
    type: Number,
    required: true
  }
});


module.exports = mongoose.model('Tripp', TrippSchema);