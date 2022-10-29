const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (id) => {
    const SECRET_KEY = process.env.JWT_SECRET;
    const EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;

    return jwt.sign({ id }, SECRET_KEY, {
        expiresIn: EXPIRES_IN,
    });
};

module.exports = generateToken;