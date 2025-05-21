const mongoose = require('mongoose');

const editorSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Editor = mongoose.model('Editor', editorSchema);

module.exports = Editor;
