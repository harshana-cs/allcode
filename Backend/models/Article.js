const mongoose = require('mongoose');

// Check if model already exists before creating it (prevents OverwriteModelError)
const Article = mongoose.models.Article || mongoose.model(
  'Article',
  new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["technology", "politics", "sports", "health", "culture", "arts", "earth", "travel", "national"]
    },
    coverImage: { type: String, default: "" },
    additionalImage1: { type: String, default: "" },
    additionalImage2: { type: String, default: "" },
    author: { type: String, required: true },  // <-- Added field for author name
    status: { 
      type: String, 
      enum: ["draft", "review", "pending", "approved", "rejected"], 
      default: "draft" 
    }
  }, { timestamps: true }),
  'articles'
);





module.exports = {Article,};

