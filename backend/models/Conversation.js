const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema({
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
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isStreaming: { type: Boolean, default: false },
    meetingId: { type: String, default: null },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
    },],
}, { timestamps: true });

const Chat = mongoose.model("Chat", ConversationSchema);

module.exports = Chat;