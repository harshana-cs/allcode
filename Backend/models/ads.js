const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({
    title: { type: String, required: true },
    websiteLink: { type: String, required: true },
    position: { type: String, enum: ['Top', 'Bottom', 'Popup'], required: true },
    duration: { type: Number, required: true },
    imageUrl: { type: String } // Store the image as a URL
}, { timestamps: true });

module.exports = mongoose.model("Ad", AdSchema);