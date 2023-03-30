const router = require("express").Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { generateToken, generateRefreshToken } = require("../config/generateToken");
const { protect } = require("../middleware/authMiddleware");

require("dotenv").config();

const accountSID = process.env.OTP_ACCOUNT_SID;
const authToken = process.env.OTP_AUTH_TOKEN;
const serviceSID = process.env.OTP_SERVICE_SID;

const client = require("twilio")(accountSID, authToken);

const Chat = require("../models/Conversation");
const User = require("../models/User");
const EventTable = require("../models/EventTable");

let refreshTokens = [];

// send new access token
router.post("/token", (req, res) => {
    //take the refresh token from the user
    const refreshToken = req.body.token;
    
    //send error if there is no token or it's invalid
    if (!refreshToken) return res.status(401).json("You are not authenticated!");
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid!");
    }
    
    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        console.log("refresh token after filter ", refreshTokens)
        console.log("user id ", user.id)
        
        const newAccessToken = generateToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);
        
        refreshTokens.push(newRefreshToken);
        console.log("refresh token after pushing ", refreshTokens)
        
        res.status(200).json({
            token: newAccessToken,
            refreshToken: newRefreshToken,
        });
    });
});

// register
router.post("/register", async (req, res) => {
    try {
        // generate  new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        //create new user
        const newUser = new User({
            username: req.body.username,
            number: req.body.number1.number,
            password: hashedPassword,
            pic: req.body.pic
        })
        // console.log(newUser);
        
        //save user and send response
        const user = await newUser.save();
        
        const accessToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        refreshTokens.push(refreshToken);
        
        // console.log(user)
        res.status(200).json({
            _id: user._id,
            username: user.username,
            number: user.number,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: accessToken,
            refreshToken: refreshToken
        })
        
    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
})

//login
router.post("/login", async (req, res) => {
    try {
        
        // find the user
        const user = await User.findOne({ username: req.body.username })
        // console.log(user)
        
        if (!user) {
            return res.status(400).json("Wrong Username or Password")
        }
        
        // validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        
        if (!validPassword) {
            return res.status(400).json("Wrong Username or Password")
        }

        const accessToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        refreshTokens.push(refreshToken);
        console.log("first refresh token ", refreshTokens)
        
        // send res
        res.status(200).json({
            _id: user._id,
            username: user.username,
            number: user.number,
            pic: user.pic,
            token: accessToken,
            refreshToken: refreshToken
        })


    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
})

//get user online status
router.get("/check-online/:id", protect, async (req, res) => {
    // console.log(req.params.id)
    try {
        const user = await User.findOne({ _id: req.params.id })

        if (!user) {
            return res.status(400).json("User not found")
        }

        res.status(200).json({
            _id: user._id,
            username: user.username,
            isOnline: user.isOnline,
        })

    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
});

// search query for users and groups excluding user logged in
router.get("/", protect, async (req, res) => {
    const query = req.query.search;

    try {
        const users = await User.find({
            $or: [{ username: { $regex: query, $options: "i" } }]
        }).find({ _id: { $ne: req.user._id } });
        const groups = await Chat.find({
            $or: [{ chatName: { $regex: query, $options: "i" } }]
        }).find({ isGroupChat: true, _id: { $ne: req.user._id } });
        const events = await EventTable.find({
            $or: [{ name: { $regex: query, $options: "i" } }]
        });
        res.status(200).json({
            users: users,
            groups: groups,
            events: events
        })
    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
});

// forget password check phone number and send otp
router.post("/forget-password-check-number", async (req, res) => {
    try {
        const user = await User.findOne({ number: req.body.number })
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        client.verify
            .services(serviceSID)
            .verifications.create({
                to: `${req.body.number}`,
                channel: "sms",
            })
            .then((data) => {
                res.status(200).json({
                    message: "OTP sent",
                })
            })
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        })
        console.log(err)
    }
});

// forget password check otp and change password
router.post("/forget-password-check-otp-change-password", async (req, res) => {
    try {
        const user = await User.findOne({ number: `${req.body.number}` })
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        client.verify
            .services(serviceSID)
            .verificationChecks.create({
                to: `${req.body.number}`,
                code: req.body.otp,
            })
            .then(async (data) => {
                if (data.valid) {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(req.body.password, salt)
                    user.password = hashedPassword
                    await user.save()
                    res.status(200).json({
                        message: "Password changed",
                    })
                } else {
                    res.status(400).json({
                        message: "OTP not valid",
                    })
                }
            })
            .catch((err) => {
                res.status(400).json({
                    message: "OTP not valid",
                })
            })
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        })
        console.log(err)
    }
});

// check if username is available
router.get("/check-username/:username", async (req, res) => {
    try {
        if (req.params.username.length > 2) {
            const user = await User.findOne({ username: req.params.username })

            if (user) {
                return res.status(200).json({
                    message: "Username not available"
                })
            }

            res.status(200).json({
                message: "Username available"
            })
        }

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        })
        console.log(err)
    }
});

// user info
router.get("/user-info", protect, async (req, res) => {
    const userId = req.user._id;

    await User.findById(userId)
        .then((user) => {
            res.status(200).json({
                _id: user._id,
                username: user.username,
                number: user.number,
                pic: user.pic,
            })
        })
        .catch((err) => {
            res.status(500).json(err)
            console.log(err)
        })
});

// change password
router.put("/change-password", protect, async (req, res) => {
    const userId = req.user._id;

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
        return res.status(400).send("All fields are required")
    }

    if (newPassword.length <= 6) {
        return res.status(400).send("Password must be greater than 6 characters")
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).send("Passwords do not match")
    }

    if (oldPassword === newPassword) {
        return res.status(400).send("Old password and new password cannot be same")
    }

    await User.findById(userId)
        .then(async (user) => {
            const validPassword = await bcrypt.compare(oldPassword, user.password);

            if (!validPassword) {
                return res.status(400).send("Wrong Password")
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            user.password = hashedPassword
            await user.save()
            res.status(200).send("Password changed")
        })
        .catch((err) => {
            res.status(500).send("Something went wrong")
            console.log(err)
        })
});

// update user info
router.put("/update-user-info", protect, async (req, res) => {
    const userId = req.user._id;
    const { username, pic } = req.body;

    if (!username && !pic) {
        return res.status(400).send("No data to update")
    }

    let message = "";

    await User.findById(userId)
        .then(async (user) => {
            if (username && !pic) {
                user.username = username
                message = "Username updated"
            } else if (!username && pic) {
                user.pic = pic
                message = "Profile picture updated"
            } else if (username && pic) {
                user.username = username
                user.pic = pic
                message = "Username and profile picture updated"
            }
            await user.save()
            res.status(200).send({
                message: message,
                _id: user._id,
                username: user.username,
                number: user.number,
                pic: user.pic,
            });
        })
        .catch((err) => {
            res.status(500).send("Something went wrong")
            console.log(err)
        })
});

router.post("/logout", (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    console.log(refreshTokens, "refreshTokens after logout filter")
    res.status(200).json("You logged out successfully.");
});

module.exports = router;