const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 2,
        max: 20,
        unique: true
    },
    phonenumber: {
        type: Number,
        require: true,
        max: 14,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 8
    },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema)