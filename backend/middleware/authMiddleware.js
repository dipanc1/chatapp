const jwt = require("jsonwebtoken");
const User = require("../models/User");

const asyncHandler = require("express-async-handler");

require("dotenv").config();

const protect = asyncHandler(async (req, res, next) => {
    let token;
    const SECRET_KEY = process.env.JWT_SECRET;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            //decodes token id
            const decoded = jwt.verify(token, SECRET_KEY);

            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
            console.log("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
        console.log("Not authorized, no token");
    }
});

module.exports = { protect };