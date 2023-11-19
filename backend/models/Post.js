const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: String, trim: true },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;

