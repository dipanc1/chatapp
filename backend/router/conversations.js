const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

require("dotenv").config();

const User = require("../models/User");
const Chat = require("../models/Chat");
const EventTable = require("../models/EventTable");
const Post = require("../models/Post");

const { protect } = require("../middleware/authMiddleware");
const { generateGroupToken } = require("../config/generateToken");

const LIMIT = process.env.LIMIT;

// new chat
router.post("/", protect, asyncHandler(async (req, res) => {

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
        select: "username email pic"
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


// get all chats of user
router.get("/", protect, async (req, res) => {
    try {
        Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate("users", "-password -events")
            .populate("groupAdmin", "-password -events")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "username email pic"
                });
                res.status(200).json(results);
            })
    } catch (error) {
        res.status(500).json(error)
    }
});


// get chat by id
router.get("/:id", protect, asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const findChat = await Chat.findById(id)
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        if (!findChat) {
            return res.status(404).send("No chat found")
        }

        res.status(200).json(findChat);
    } catch (error) {
        res.status(500).send("Something went wrong")
    }

}));


// get all one on one conversations with infinite scroll
router.get("/one-on-one/:page", protect, async (req, res) => {
    const { page } = req.params;

    try {
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } },
            isGroupChat: false,
        })
            .populate("users", "-password -events")
            .populate("groupAdmin", "-password -events")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .skip((page - 1) * LIMIT)
            .limit(LIMIT)
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "username email pic"
                });

                return results;
            });

        const totalCount = await Chat.countDocuments({
            users: { $elemMatch: { $eq: req.user._id } },
            isGroupChat: false,
        });

        if (!chats) {
            return res.status(404).send("No chats found")
        }

        res.status(200).json({
            chats,
            hasMore: totalCount - (page * LIMIT) > 0,
        });

    } catch (error) {

    }
});


// get all group chats of user with infinite scroll
router.get("/group-chats/:page", protect, asyncHandler(async (req, res) => {
    const { page } = req.params;

    const limit = LIMIT;

    try {
        const groups = await Chat.find(
            {
                isGroupChat: true,
                users: { $elemMatch: { $eq: req.user._id } },
                isSuspended: false
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "username email pic"
                });
                return results;
            });

        const totalCount = await Chat.countDocuments({
            isGroupChat: true,
            users: { $elemMatch: { $eq: req.user._id } },
            isSuspended: false
        });

        if (!groups) {
            return res.status(404).send("No group chats found")
        }

        res.status(200).json({
            groups,
            hasMore: totalCount - (page * limit) > 0
        });


    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }

}));


// get all group chats of user with pagination
router.get("/my/:page", protect, async (req, res) => {
    const { page } = req.params;
    const limit = LIMIT;
    const skip = (page - 1) * limit;

    try {
        const totalCount = await Chat.countDocuments({
            isGroupChat: true,
            users: { $elemMatch: { $eq: req.user._id } },
        });
        const currentCount = await Chat.countDocuments({
            isGroupChat: true,
            users: { $elemMatch: { $eq: req.user._id } },
        }, { skip, limit });
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = parseInt(page);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;
        let chats = await Chat.find({
            isGroupChat: true,
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "-password -events")
            .populate("groupAdmin", "-password -events")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);
        chats.filter((chat) => {
            return chat.isSuspended === false;
        });
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "username email pic"
        });
        const upcomingEvents = await EventTable.find({
            isDisabled: false, chatId: { $in: chats }, date: { $gte: new Date() }
        });
        res.status(200).json({
            chats,
            upcomingEvents,
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
});


// get all chats where user is admin
router.get("/admin/:page", protect, async (req, res) => {
    const { page } = req.params;
    const limit = LIMIT;
    const skip = (page - 1) * limit;

    try {
        const totalCount = await Chat.countDocuments({
            groupAdmin: { $eq: req.user._id }
        });
        const currentCount = await Chat.countDocuments({
            groupAdmin: { $eq: req.user._id }
        }, { skip, limit });
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = parseInt(page);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;
        let chats = await Chat.find({
            groupAdmin: { $eq: req.user._id },
        })
            .populate("users", "-password -events")
            .populate("groupAdmin", "-password -events")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);
        chats.filter((chat) => {
            return chat.isSuspended === false;
        });
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "username email pic"
        });
        const upcomingEvents = await EventTable.find({
            isDisabled: false, chatId: { $in: chats }, date: { $gte: new Date() }
        });
        res.status(200).json({
            chats,
            upcomingEvents,
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
});


// get all group chats with pagination
router.get("/all/:page", asyncHandler(async (req, res) => {
    const { page } = req.params;
    const limit = LIMIT;
    const skip = (page - 1) * limit;

    Chat.collection.createIndex({ isGroupChat: 1, isSuspended: 1, createdAt: -1 });
    let groups = await Chat.find({ isGroupChat: true, isSuspended: false })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const upcomingEvents = await EventTable.find({
        isDisabled: false, chatId: { $in: groups }, date: { $gte: new Date() }
    });
    const totalCount = await Chat.countDocuments({ isGroupChat: true, isSuspended: false });
    const currentCount = groups.length;
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = parseInt(page);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    if (!groups) {
        return res.status(404).send("No group chats found")
    }

    res.status(200).json({
        groups,
        upcomingEvents,
        totalCount,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        currentCount
    });
}));


// get encrypted chatid by chatid
router.get("/encrypted/:id", protect, asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const encryptedChatId = generateGroupToken(id);

        res.status(200).json({
            encryptedChatId,
        });
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
}));


// get chat by encrypted id
router.get("/encrypted/chat/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        jwt.verify(id, process.env.GROUP_ID_JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(500).send("Something went wrong")
            }

            const findChat = await Chat.findById(decoded.id)
                .populate("users", "-password")
                .populate("groupAdmin", "-password")

            // check if chat is suspended
            if (findChat.isSuspended) {
                return res.status(400).send("Chat is suspended")
            }

            if (!findChat) {
                return res.status(404).send("No chat found")
            }

            const events = await EventTable.find({ chatId: findChat._id, isDisabled: false });

            const posts = await Post.find({ chat: findChat._id }).sort({ createdAt: -1 });

            res.status(200).json({
                chat: findChat,
                events,
                posts
            });
        })
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
}));


// get chat by slug
router.get("/slug/:slug", asyncHandler(async (req, res) => {
    try {
        const findChat = await Chat.findOne({ slug: req.params.slug })

        // check if chat is suspended
        if (findChat.isSuspended) {
            return res.status(400).send("Chat is suspended")
        }

        if (!findChat) {
            return res.status(404).send("No chat found")
        }

        const chat = await Chat.findById(findChat._id)
            .populate("users", "-password")
            .populate("groupAdmin", "-password")


        const events = await EventTable.find({ chatId: findChat._id, isDisabled: false });
        const posts = await Post.find({ chat: findChat._id }).sort({ createdAt: -1 });


        res.status(200).json({
            chat,
            events,
            posts
        });
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
}));


// create groups
router.post("/group", protect, asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name || !req.body.description) {
        return res.status(400).send("All Feilds are required")
    }

    const checkGroupChat = await Chat.find({ chatName: req.body.name });
    if (checkGroupChat.length > 0) {
        return res.status(400).send("Group chat with same name already exists")
    }

    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res.status(400).send("You need at least 2 members to create a group")
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            description: req.body.description,
            isGroupChat: true,
            users: users,
            slug: _.kebabCase(req.body.name),
            groupAdmin: req.user
        });

        await groupChat.save();

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(500).json(error)
    }

}));


// renaming group
router.put("/rename", protect, asyncHandler(async (req, res) => {
    const { chatId, chatName, description } = req.body;

    if (!chatId || !chatName || !description) {
        return res.status(400).send("All Feilds are required")
    }

    // check if chat is suspended    
    const checkGroupChat = await Chat.find({ chatName });

    if (checkGroupChat.isSuspended) {
        return res.status(400).send("Chat is suspended")
    }

    if (checkGroupChat.length > 0) {
        return res.status(400).send("Group chat with same name already exists")
    }

    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        chatName, description,
        slug: _.kebabCase(chatName)
    }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!updatedChat) {
        return res.status(404).send("Chat not found")
    } else {
        res.status(200).json(updatedChat);
    }
}));


// adding in group
router.put("/groupadd", protect, asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const isSuspended = await Chat.findById(chatId);
    if (isSuspended.isSuspended) {
        return res.status(400).send("Chat is suspended")
    }

    const isUser = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId } } });

    if (isUser) {
        return await Chat.findOne({ _id: chatId })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .then((results) => {
                res.status(200).json(results);
            })
    }

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
router.put("/groupremove", protect, asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if chat is suspended
    const chat = await Chat.findById(chatId);
    if (chat.isSuspended) {
        return res.status(400).send("Chat is suspended")
    }

    // check if group admin leave make some other admin
    const isGroupAdmin = await Chat.findOne({ _id: chatId, groupAdmin: { $eq: userId } });
    if (isGroupAdmin) {
        const newAdmin = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $ne: userId } } });
        if (newAdmin) {
            await Chat.findByIdAndUpdate(chatId, { groupAdmin: newAdmin.users[0] });
        }
    }

    // check if last user tries to leave the group don't let it leave
    const isLastUser = await Chat.findOne({ _id: chatId, users: { $size: 1 } });
    if (isLastUser) {
        return res.status(400).send("You are the last member of this group")
    }

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


// make someone admin of group by superadmin
router.put("/groupmakeadmin", protect, asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if user is superadmin
    const checkSuperAdmin = await User.findById(req.user._id);

    if (!checkSuperAdmin.isSuperAdmin) {
        return res.status(400).send("You are not super admin")
    }


    const isGroupAdmin = await Chat.findOne({ _id: chatId, groupAdmin: { $eq: userId } });
    if (isGroupAdmin) {
        return res.status(400).send("User is already admin")
    }


    // check if user is in group
    const isUser = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId } } });

    if (!isUser) {
        return res.status(400).send("User is not in group")
    }

    // make user admin
    const makeAdmin = await Chat.findByIdAndUpdate(chatId, { groupAdmin: userId }, { new: true })

    if (!makeAdmin) {
        return res.status(404).send("Chat not found")
    } else {
        res.status(200).json({
            message: "User is now admin"
        });
    }

}));


// suspend group by superadmin
router.put("/groupsuspend", protect, asyncHandler(async (req, res) => {
    const { chatId } = req.body;

    try {

        // check if user is superadmin
        const checkSuperAdmin = await User.findById(req.user._id);

        if (!checkSuperAdmin.isSuperAdmin) {
            return res.status(400).send("You are not super admin")
        }

        // check if group is already suspended
        const findGroup = await Chat.findById(chatId);

        if (findGroup.isSuspended) {
            // unsuspend group
            await Chat.findByIdAndUpdate(chatId, { isSuspended: false });
            return res.status(200).send("Group unsuspended");
        }

        // suspend group
        await Chat.findByIdAndUpdate(chatId, { isSuspended: true });
        return res.status(200).send("Group suspended");
    } catch (error) {
        return res.status(500).send("Something went wrong")
    }

}));


// get a list groups with pagination
router.get("/list/:limit", protect, asyncHandler(async (req, res) => {
    if (!req.user.isSuperAdmin) {
        return res.status(400).send("You are not super admin")
    }

    const limit = parseInt(req.params.limit)
    const page = req.query.page
        ? parseInt(req.query.page)
        : 1;
    const skip = (page - 1) * limit;

    try {
        const groups = await Chat.find({
            isGroupChat: true,
        })
            .populate("users", "-password -events")
            .populate("groupAdmin", "-password -events")
            .skip(skip)
            .limit(limit)
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "username email pic"
                });

                return results;
            });

        const total = await Chat.countDocuments({
            isGroupChat: true,
        });


        const pages = Math.ceil(total / limit);

        if (!groups) {
            return res.status(404).send("No chats found")
        }

        res.status(200).json({
            groups,
            pages,
            total,
            page,
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
}));


// start streaming
router.put("/stream", protect, asyncHandler(async (req, res) => {
    // console.log(req.body)
    const { data } = req.body;

    Chat.findByIdAndUpdate(data.chatId, {
        $set: {
            isStreaming: true,
            meetingId: data.meetingId,
        },
    }).then((chat) => {
        // console.log("streaming");
        res.status(200).json({
            message: "streaming",
        });
    }).catch((err) => {
        console.log(err);
    });

}));


// stop streaming
router.put("/stop-stream", protect, asyncHandler(async (req, res) => {
    // console.log(req.body)
    const { data } = req.body;

    Chat.findByIdAndUpdate(data.chatId, {
        $set: {
            isStreaming: false,
            meetingId: null,
        },
    }).then((chat) => {
        console.log("streaming stopped!!");
        res.status(200).json({ msg: "streaming stopped!!" });
    }).catch((err) => {
        console.log(err);
    });

}));


// get streaming meeting id
router.get("/streaming/:chatid", protect, asyncHandler(async (req, res) => {

    const { chatid } = req.params;

    Chat.findById(chatid).then((chat) => {
        if (chat.isStreaming) {
            res.status(200).json(chat.meetingId);
        } else {
            res.status(200).json(null);
        }
    }).catch((err) => {
        console.log(err);
    })
}));


module.exports = router;