const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (id) => {
    const SECRET_KEY = process.env.JWT_SECRET;
    const EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;

    return jwt.sign({ id }, SECRET_KEY, {
        expiresIn: EXPIRES_IN,
    });
};

const generateRefreshToken = (id) => {
    const SECRET_KEY = process.env.REFRESH_JWT_SECRET;
    const EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

    return jwt.sign({ id }, SECRET_KEY, {
        expiresIn: EXPIRES_IN,
    });
};

const generateGroupToken = (id) => {
    const SECRET_KEY = process.env.GROUP_ID_JWT_SECRET;

    return jwt.sign({ id }, SECRET_KEY);
};


module.exports = {
    generateToken,
    generateRefreshToken,
    generateGroupToken
};