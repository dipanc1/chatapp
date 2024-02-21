const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 2,
        max: 20,
        unique: true
    },
    // TODO: Will do it next phase
    // number: {
    //     type: Number,
    //     required: true,
    //     unique: true
    // },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    pic: {
        type: String,
        required: false,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    isOnline: {
        type: Boolean,
        required: true,
        default: false,
    },
    socketId: {
        type: String,
        default: null,
    },
    isSuperAdmin: {
        type: Boolean,
        default: false,
    },
    isSuspended: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;