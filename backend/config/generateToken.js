const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, "jatt", {
        expiresIn: "30y",
    });
};

module.exports = generateToken;