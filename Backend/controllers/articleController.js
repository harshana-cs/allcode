const { Article } = require('../models/article');

exports.submitArticle = async (req, res) => {
  try {
    const { title, content, category, status, author } = req.body;

    if (!author) {
      return res.status(400).json({ error: "Author is required" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const newArticle = new Article({
      title,
      content,
      category,
      author,
      status: status || 'draft',
      coverImage: req.files.coverImage?.[0]
        ? baseUrl + req.files.coverImage[0].path.replace(/\\/g, "/")
        : "",
      additionalImage1: req.files.additionalImage1?.[0]
        ? baseUrl + req.files.additionalImage1[0].path.replace(/\\/g, "/")
        : "",
      additionalImage2: req.files.additionalImage2?.[0]
        ? baseUrl + req.files.additionalImage2[0].path.replace(/\\/g, "/")
        : "",
    });

    await newArticle.save();
    res.status(201).json({ message: "✅ Article submitted successfully." });
  } catch (error) {
    console.error("❌ Article save failed:", error);
    res.status(500).json({ message: "❌ Article submission failed." });
  }
};
