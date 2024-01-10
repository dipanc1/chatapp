const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
    name: { type: String, unique: true },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    time: { type: String, trim: true },
    thumbnail: { type: String, trim: true, default: "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg" },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDisabled: { type: Boolean, default: false },
}, { timestamps: true });

const EventTable = mongoose.model("Event", EventSchema);

module.exports = EventTable;