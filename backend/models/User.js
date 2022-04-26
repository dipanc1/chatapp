const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 2,
        max: 20,
        unique: true
    },
    number: {
        type: Number,
        required: true,
        // unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    pic: {
        type: String,
        required: true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;