const router = require("express").Router();

const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const LIMIT = 8;

// add
router.post("/", async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        return res.status(400).json({
            message: "Please provide content and chatId"
        })
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    // console.log(newMessage);

    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "username pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "username pic number"
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });
        res.status(200).json({
            message
        });
    } catch (error) {
        res.status(500).json(error)
    }
});


//get
router.get("/:chatId/:page", async (req, res) => {
    const { limit = LIMIT } = req.query;

    try {
        const totalCount = await Message.countDocuments({
            chat: req.params.chatId
        });

        const messages = await Message.find({ chat: req.params.chatId })
            .sort({ createdAt: -1 })
            .skip((req.params.page - 1) * limit)
            .limit(limit)
            .populate("sender", "username pic number")
            .populate("chat");

        res.status(200).json({
            messages,
            hasMore: totalCount - (req.params.page * limit) > 0,
        });
    } catch (error) {
        res.status(500).json(error)
    }
});


// message is read
router.post("/read", async (req, res) => {
    const userId = req.user._id;
    try {
        const { messageId } = req.body;
        if (!messageId) {
            return res.status(400).json({
                message: "Please provide messageId"
            })
        }

        // if message is written by user don't update
        const message = await Message.findOne({
            _id: messageId,
            sender: userId
        });

        if (message) {
            return res.status(200).json({
                message: "Message is written by user"
            });
        }

        // if message is already read by user don't update
        if (await Message.findOne({
            _id: messageId, readBy:
                { $in: [userId] }
        })) {
            return res.status(200).json({
                message: "Message is already read"
            });
        } else {
            // if message is not read by user, update
            await Message.findByIdAndUpdate(messageId, {
                readBy: [userId]
            });
            res.status(200).json({
                message: "Message is read"
            });
        }
    } catch (error) {
        res.status(500).json(error)
    }
});


module.exports = router;