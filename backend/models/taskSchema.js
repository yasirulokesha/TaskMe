const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  username: {
    type: String,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  }, 
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);