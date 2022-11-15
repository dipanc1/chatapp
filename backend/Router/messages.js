const router = require("express").Router();

const Chat = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

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
    //TODO: make it 50 or 100
    const { limit = 8 } = req.query;

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
    try {
        const { messageId } = req.body;
        if (!messageId) {
            return res.status(400).json({
                message: "Please provide messageId"
            })
        }

        await Message.findByIdAndUpdate(messageId, {
            readBy: [req.user._id]
        });
        res.status(200).json({
            message: "Message is read"
        });
    } catch (error) {
        res.status(500).json(error)
    }
});


module.exports = router;