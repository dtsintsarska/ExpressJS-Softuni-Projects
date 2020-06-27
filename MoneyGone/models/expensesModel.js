const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  merchant: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50
  },
  report: {
    type: Boolean,
    default: false
  },
  user: {
    type: 'ObjectId',
    ref: 'User',
  }
});


module.exports = mongoose.model('Expenses', ExpenseSchema);