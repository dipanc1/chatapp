const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    description: { type: String, trim: true },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    posts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },],
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isStreaming: { type: Boolean, default: false },
    meetingId: { type: String, default: null },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
    },],
    slug: { type: String, trim: true },
    isSuspended: { type: Boolean, default: false },
}, { timestamps: true });

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;