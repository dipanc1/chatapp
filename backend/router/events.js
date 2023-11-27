const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

require("dotenv").config();

const Chat = require("../models/Chat");
const EventTable = require("../models/EventTable");
const Donations = require("../models/Donations");

const { protect } = require("../middleware/authMiddleware");

const LIMIT = process.env.LIMIT;

// add an event to the group conversation
router.put("/:chatId", protect, asyncHandler(async (req, res) => {
    const { name, description, date, time, thumbnail } = req.body;
    const { chatId } = req.params;

    if (!name || !description || !date || !time) {
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
    };

    const checkEvent = await EventTable.find({ name: name });

    if (checkEvent.length > 0) {
        return res.status(400).send("Event with same name already exists")
    }

    const newEvent = new EventTable({
        name,
        description,
        date,
        time,
        thumbnail,
        chatId,
        createdBy: userId,
    });

    const savedEvent = await newEvent.save();

    // console.log(savedEvent);

    if (updateGroupChat) {
        res.status(200).json(savedEvent);
    } else {
        res.status(404).send("Chat not found or user not found or event not saved");
    }
}));


// edit event 
router.put("/edit/:eventId", protect, asyncHandler(async (req, res) => {
    const { name, description, date, time, thumbnail, chatId } = req.body;
    const { eventId } = req.params;
    const userId = req.user._id;

    const updateGroupChat = await Chat.findById(chatId);

    // check if chat is suspended
    if (updateGroupChat.isSuspended) {
        return res.status(400).send("Chat is suspended")
    }

    if (updateGroupChat.groupAdmin.toString() != userId.toString()) {
        return res.status(400).send("You are not admin of this group")
    };

    // check if the event is disabled
    const checkEvent = await EventTable.findById(eventId);
    if (checkEvent.isDisabled) {
        return res.status(400).send("Event is disabled")
    }

    const findEventandUpdate = await EventTable.findByIdAndUpdate(eventId, {
        name,
        description,
        date,
        time,
        thumbnail,
    }, { new: true });

    if (!findEventandUpdate) {
        return res.status(404).send("Event not found")
    } else {
        res.status(200).json(findEventandUpdate);
    }

}));


// delete event
router.delete("/delete/:eventId/:chatId", protect, asyncHandler(async (req, res) => {
    const { eventId, chatId } = req.params;
    const userId = req.user._id;

    const updateGroupChat = await Chat.findById(chatId);

    // check if chat is suspended
    if (updateGroupChat.isSuspended) {
        return res.status(400).send("Chat is suspended")
    }

    if (updateGroupChat.groupAdmin.toString() != userId.toString()) {
        return res.status(400).send("You are not admin of this group")
    };

    const findEventAndDelete = await EventTable.findByIdAndDelete(eventId);

    const findEventInDonationsAndDeleteDonation = await Donations.deleteOne({ event: eventId });

    if (!findEventAndDelete || !findEventInDonationsAndDeleteDonation) {
        return res.status(404).send("Event not found")
    }

    res.status(200).json({
        message: "Event deleted",
    });

}));


// get events of a particular group
router.get("/:chatId", protect, asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    const findGroupById = await Chat.findById(chatId);

    // check if chat is suspended
    if (findGroupById.isSuspended) {
        return res.status(400).send("Chat is suspended")
    }

    if (!findGroupById) {
        return res.status(404).send("Group not found")
    }

    // find all events of a group
    const findEvents = await EventTable.find(
        {
            chatId,
            isDisabled: false
        }
    ).sort({ createdAt: -1 });
    res.status(200).json(findEvents);
}));


// get all events with pagination
router.get("/all/:page", protect, asyncHandler(async (req, res) => {
    const { page } = req.params;
    const limit = LIMIT;
    const skip = (page - 1) * limit;

    try {
        const events = await EventTable.find({
            isDisabled: false
        }).skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalCount = await EventTable.countDocuments({ isDisabled: false });
        const currentCount = events.length;
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = parseInt(page);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

        if (!events) {
            return res.status(404).send("No events found")
        }

        res.status(200).json({
            events,
            totalCount,
            totalPages,
            currentPage,
            hasNextPage,
            hasPrevPage,
            currentCount
        });
    } catch (error) {
        console.log(error);
    }

}));


// get upcoming events with pagination
router.get("/upcoming/:page", protect, asyncHandler(async (req, res) => {
    const { page } = req.params;
    const limit = LIMIT;
    const skip = (page - 1) * limit;

    try {
        let events = await EventTable.find({
            date: { $gte: new Date() },
            isDisabled: false
        }).skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalCount = await EventTable.countDocuments({ date: { $gte: new Date() }, isDisabled: false });
        const currentCount = events.length;
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = parseInt(page);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

        if (!events) {
            return res.status(404).send("No events found")
        }

        res.status(200).json({
            events,
            totalCount,
            totalPages,
            currentPage,
            hasNextPage,
            hasPrevPage,
            currentCount
        });
    } catch (error) {
        console.log(error);
    }

}));


// get past events with pagination
router.get("/past/:page", protect, asyncHandler(async (req, res) => {
    const { page } = req.params;
    const limit = LIMIT;
    const skip = (page - 1) * limit;

    try {
        let events = await EventTable.find({
            date: { $lt: new Date() },
            isDisabled: false
        }).skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalCount = await EventTable.countDocuments({
            date: { $lt: new Date() },
            isDisabled: false
        });
        const currentCount = events.length;
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = parseInt(page);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

        if (!events) {
            return res.status(404).send("No events found")
        }

        res.status(200).json({
            events,
            totalCount,
            totalPages,
            currentPage,
            hasNextPage,
            hasPrevPage,
            currentCount
        });
    } catch (error) {
        console.log(error);
    }

}));


// disable an event
router.put("/disable/:eventId", protect, asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    try {
        if (!eventId) {
            return res.status(400).send("eventId is required")
        }

        // find event
        const findEvent = await EventTable.findById(eventId);

        if (!findEvent) {
            return res.status(404).send("Event not found")
        }

        // if event is already disabled
        if (findEvent.isDisabled) {
            // enable event
            await EventTable.findByIdAndUpdate(eventId, { isDisabled: false });
            return res.status(200).send("Event enabled");
        }

        // disable event
        await EventTable.findByIdAndUpdate(eventId, { isDisabled: true });
        return res.status(200).send("Event disabled");


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }

}));


// get all list of all events
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
        const events = await EventTable.find({
        })
            .skip(skip)
            .limit(limit);

        const total = await EventTable.countDocuments({
        });

        const pages = Math.ceil(total / limit);

        if (!events) {
            return res.status(404).send("No events found")
        }

        res.status(200).json({
            events,
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



module.exports = router;