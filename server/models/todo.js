const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
  description: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  }
});

module.exports = {
  Todo
};
