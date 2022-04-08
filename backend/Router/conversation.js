const router = require("express").Router();
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const Chat = require("../models/Conversation")

//new conversation

router.post("/", asyncHandler(async(req, res) => {

    const { userId } = req.body;

    if (!userId) {
        console.log("userId is required");
        return res.status(400).json("userId is required");
    }

    var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "username number pic"
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(500).json(error)
        }
    }
}));

//get all chats
router.get("/", async(req, res) => {
    try {
        Chat.find({
                users: { $elemMatch: { $eq: req.user._id } }
            })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async(results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "username number pic"
                });
                res.status(200).json(results);
            })
    } catch (error) {
        res.status(500).json(error)
    }
})

// create groups

//renaming group

// removing people from group

// adding in group

module.exports = router;