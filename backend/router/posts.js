const router = require("express").Router();
const asyncHandler = require("express-async-handler");

require("dotenv").config();

const Chat = require("../models/Chat");
const Post = require("../models/Post");

const { protect } = require("../middleware/authMiddleware");

const LIMIT = process.env.LIMIT;

// create post for a group
router.post("/:chatId", protect, asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    const { title, description, image } = req.body;

    if (!title || !description || !image) {
        return res.status(400).send("All Feilds are required")
    }

    const userId = req.user._id;

    const updateGroupChat = await Chat.findById(chatId);

    // check if chat is suspended
    if (updateGroupChat.isSuspended) {
        return res.status(400).send("Chat is suspended")
    }

    if (updateGroupChat.groupAdmin.toString() != userId.toString()) {
        return res.status(400).send("You are not admin of this group")
    }

    const newPost = new Post({
        title,
        description,
        image,
        createdBy: userId,
        chat: chatId,
    });

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);

    } catch (error) {

        res.status(500).json(error)
    }

}));


// edit post
router.put("/edit/:postId/:chatId", protect, asyncHandler(async (req, res) => {
    const { title, description, image } = req.body;
    const { postId, chatId } = req.params;
    const userId = req.user._id;

    const updateGroupChat = await Chat.findById(chatId);

    // check if chat is suspended
    if (updateGroupChat.isSuspended) {
        return res.status(400).send("Chat is suspended")
    }

    if (updateGroupChat.groupAdmin.toString() != userId.toString()) {
        return res.status(400).send("You are not admin of this group")
    };

    const findPostandUpdate = await Post.findByIdAndUpdate(postId, {
        title,
        description,
        image,
    }, { new: true });

    if (!findPostandUpdate) {
        return res.status(404).send("Post not found")
    } else {
        res.status(200).json(findPostandUpdate);
    }

}));


// delete post
router.delete("/delete/:postId/:chatId", protect, asyncHandler(async (req, res) => {
    const { postId, chatId } = req.params;
    const userId = req.user._id;

    const updateGroupChat = await Chat.findById(chatId);

    // check if chat is suspended
    if (updateGroupChat.isSuspended) {
        return res.status(400).send("Chat is suspended")
    }

    if (updateGroupChat.groupAdmin.toString() != userId.toString()) {
        return res.status(400).send("You are not admin of this group")
    };

    const findPostAndDelete = await Post.findByIdAndDelete(postId);

    if (!findPostAndDelete) {
        return res.status(404).send("Post not found")
    }

    res.status(200).json({
        message: "Post deleted",
    });

}));


// get all posts made by a user
router.get("/all/:page", protect, asyncHandler(async (req, res) => {
    const { page } = req.params;
    const limit = LIMIT;
    const skip = (page - 1) * limit;

    try {
        const posts = await Post.find({
            createdBy: req.user._id
        }).skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalCount = await Post.countDocuments({ createdBy: req.user._id });
        const currentCount = posts.length;
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = parseInt(page);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

        if (!posts) {
            return res.status(404).send("No posts found")
        }

        res.status(200).json({
            posts,
            totalCount,
            totalPages,
            currentPage,
            hasNextPage,
            hasPrevPage,
            currentCount
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }

}));

// get all posts of a group
router.get("/group/:chatId/:page/:limit", protect, asyncHandler(async (req, res) => {
    const { chatId, page, limit } = req.params;
    const skip = (page - 1) * limit;

    try {
        const posts = await Post.find({
            chat: chatId
        }).skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalCount = await Post.countDocuments({ chat: chatId });
        const currentCount = posts.length;
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = parseInt(page);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

        if (!posts) {
            return res.status(404).send("No posts found")
        }

        res.status(200).json({
            posts,
            totalCount,
            totalPages,
            currentPage,
            hasNextPage,
            hasPrevPage,
            currentCount
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }

}));



module.exports = router;