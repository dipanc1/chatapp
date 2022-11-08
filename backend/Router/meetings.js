const router = require("express").Router();

const axios = require("axios");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const { protect } = require("../middleware/authMiddleware");

router.get("/get-token", protect, (req, res) => {
    const API_KEY = process.env.VIDEOSDK_API_KEY;
    const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

    const EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;


    const options = { expiresIn: EXPIRES_IN, algorithm: "HS256" };

    const payload = {
        apikey: API_KEY,
        permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
    };

    const token = jwt.sign(payload, SECRET_KEY, options);
    res.json({ token });
});

router.post("/create-meeting", (req, res) => {
    // console.log(req.body);
    const { token, region } = req.body;
    const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings`;
    const options = {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ region }),
    };

    axios(url, options)
        .then((response) => {
            res.json(response.data);
        }).catch((error) => {
            res.json(error);
        });
});

router.post("/validate-meeting/:meetingId", (req, res) => {
    const token = req.body.token;
    const meetingId = req.params.meetingId;

    const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings/${meetingId}`;

    const options = {
        method: "POST",
        headers: { Authorization: token },
    };

    axios(url, options)
        .then((response) => {
            res.json(response.data);
        }).catch((error) => {
            res.json(error);
        });
});

module.exports = router;