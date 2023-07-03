const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
    name: { type: String, unique: true },
    description: { type: String },
    date: { type: Date },
    time: { type: String },
    thumbnail: { type: String },
    chatId: { type: String },
}, { timestamps: true });

const EventTable = mongoose.model("Event", EventSchema);

module.exports = EventTable;