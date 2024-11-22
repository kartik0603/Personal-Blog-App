
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: String,
  author: { type: String, required: true },
  category: String,
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  comments: [
    {
      text: { type: String, required: true }, 
      username: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
