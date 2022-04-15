const router = require("express").Router();
const Chat = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// add
router.post("/", async(req, res) => {
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

    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "username pic number"
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json(error)
    }
})

//get
router.get("/:chatId", async(req, res) => {
    try {
        const messages = await Message.find({
            chatId: req.params.chatId
        }).populate("sender", "username pic number").populate("chat");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error)
    }
});


module.exports = router;