const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 2,
        max: 20,
        // unique: true
    },
    number: {
        type: Number,
        require: true,
        // unique: true
    },
    password: {
        type: String,
        require: true,
        min: 8
    },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema)