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
router.post("/group", asyncHandler(async(req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send("All Feilds are required")
    }

    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res.status(400).send("You need at least 2 users to create a group")
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(500).json(error)
    }

}));


//renaming group
router.put("/rename", asyncHandler(async(req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!updatedChat) {
        return res.status(404).send("Chat not found")
    } else {
        res.status(200).json(updatedChat);
    }
}));


// adding in group
router.put("/groupadd", asyncHandler(async(req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(chatId, {
            $push: { users: userId }
        }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!added) {
        return res.status(404).send("Chat not found")
    } else {
        res.status(200).json(added);
    }
}));


// removing people from group
router.put("/groupremove", asyncHandler(async(req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId, {
            $pull: { users: userId }
        }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!removed) {
        return res.status(404).send("Chat not found")
    } else {
        res.status(200).json(removed);
    }
}));

module.exports = router;