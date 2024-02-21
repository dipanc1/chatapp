const router = require("express").Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


const { generateToken, generateRefreshToken } = require("../config/generateToken");
const { protect } = require("../middleware/authMiddleware");

require("dotenv").config();

const accountSID = process.env.OTP_ACCOUNT_SID;
const authToken = process.env.OTP_AUTH_TOKEN;
const serviceSID = process.env.OTP_SERVICE_SID;

const service = process.env.NODEMAILER_SERVICE;
const host = process.env.NODEMAILER_HOST;
const user_email = process.env.NODEMAILER_EMAIL;
const pass = process.env.NODEMAILER_PASS;

const client = require("twilio")(accountSID, authToken);

const Chat = require("../models/Chat");
const User = require("../models/User");
const EventTable = require("../models/EventTable");
const Post = require("../models/Post");
const Otp = require("../models/Otp");

const transporter = nodemailer.createTransport({
    service,
    host,
    port: 465,
    secure: true,
    auth: {
        user: user_email,
        pass,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const generateOtp = (email) => {
    let otp = Math.floor(10000 + Math.random() * 90000);

    new Otp({
        email,
        otp,
    }).save();

    return otp;
}

let refreshTokens = [];

const LIMIT = process.env.LIMIT;

// suspend a user
router.put("/suspend/:id", protect, async (req, res) => {
    // check if the user is super admin
    req.user.isSuperAdmin === true ? (
        // find the user
        await User.findById(req.params.id)
            .then(async (user) => {
                // if the user is not suspended
                if (user.isSuspended === false) {
                    // suspend the user
                    User.findByIdAndUpdate(req.params.id, { isSuspended: true })
                        .then((user) => {
                            res.status(200).json("User Suspended Successfully!")
                        })
                        .catch((err) => {
                            res.status(500).json(err)
                        })
                } else {
                    // if the user is suspended
                    // unsuspend the user
                    User.findByIdAndUpdate(req.params.id, { isSuspended: false })
                        .then((user) => {
                            res.status(200).json("User Unsuspended Successfully!")
                        })
                        .catch((err) => {
                            res.status(500).json(err)
                        })
                }
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    ) : (
        res.status(403).json("You are not allowed to do that!")
    )
})

// get a list of users with pagination
router.get("/list/:limit", protect, async (req, res) => {
    const limit = parseInt(req.params.limit)
    // check if the user is super admin
    req.user.isSuperAdmin === true ? (
        // get the page number
        page = req.query.page
            ? parseInt(req.query.page)
            : 1,

        // get the skip
        skip = (page - 1) * limit,

        // get the total number of users
        total = await User.countDocuments(),

        // get the total number of pages
        pages = Math.ceil(total / limit),

        // get the users
        await User.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .then((users) => {
                res.status(200).json({
                    users,
                    page,
                    pages,
                    total
                })
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    ) : (
        res.status(403).json("You are not allowed to do that!")
    )

})

// send new access token
router.post("/token", (req, res) => {
    //take the refresh token from the user
    const refreshToken = req.body.token;

    //send error if there is no token or it's invalid
    if (!refreshToken) return res.status(401).json("Your Refresh Token is not authenticated!");
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid!");
    }

    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        refreshTokens = refreshTokens.filter((token) => {
            setTimeout(() => {
                token !== refreshToken
            }, 3000);
        });

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
        // check if the user is already in the database
        const emailExist = await User.findOne({ email: req.body.email })

        if (emailExist) {
            return res.status(400).json("Email already exists")
        }

        // generate  new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //create new user
        const newUser = new User({
            username: req.body.username,
            // number: req.body.number1.number,
            email: req.body.email,
            password: hashedPassword,
            pic: req.body.pic
        })
        // console.log(newUser);

        //save user and send response
        const user = await newUser.save();

        const accessToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        // refreshTokens.push(refreshToken);

        // console.log(user)
        res.status(200).json({
            // _id: user._id,
            // username: user.username,
            // email: user.email,
            // isAdmin: user.isAdmin,
            // pic: user.pic,
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

        // check if user is suspended

        if (user.isSuspeneded === true) {
            return res.status(400).json("Your account is suspended!")
        }

        // validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(400).json("Wrong Username or Password")
        }

        const accessToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        // refreshTokens.push(refreshToken);
        // console.log("first refresh token ", refreshTokens)

        // send res
        res.status(200).json({
            // _id: user._id,
            // username: user.username,
            // email: user.email,
            // pic: user.pic,
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

// search query for users and groups excluding user logged in, events and posts
router.get("/", protect, async (req, res) => {
    const query = req.query.search;
    const limit = LIMIT;

    try {

        const users = await User.find({
            $or: [{ username: { $regex: query, $options: "i" } }]
        }).find({ _id: { $ne: req.user._id } }).limit(limit);

        const groups = await Chat.find({
            $or: [{ chatName: { $regex: query, $options: "i" } }]
        }).find({ isGroupChat: true, _id: { $ne: req.user._id } }).limit(limit);

        const events = await EventTable.find({
            $or: [{ name: { $regex: query, $options: "i" } }]
        }).limit(limit);

        const posts = await Post.find({
            $or: [{ title: { $regex: query, $options: "i" } }]
        }).limit(limit);

        res.status(200).json({
            users,
            groups,
            events,
            posts
        });

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

// forget password check email and send otp
router.post("/forget-password-check-email", async (req, res) => {
    let email = req.body.email;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        const mailOptions = {
            from: user_email,
            to: email,
            subject: "OTP for Password Reset",
            text: `Your OTP for password reset is ${generateOtp(email)}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({
                    message: "Error sending OTP",
                });
            } else {
                res.status(200).json({
                    message: `OTP sent successfully`,
                });
            }
        });

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
        const email = req.body.email;
        const otp = req.body.otp;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        let otpData = await Otp.findOne({ email, otp });

        if (otpData) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            user.password = hashedPassword
            await user.save()
            await Otp.deleteOne({ email, otp });
            res.status(200).json({
                message: "Password changed",
            })
        } else {
            res.status(400).json({
                message: "OTP not valid",
            })
        }
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
                email: user.email,
                pic: user.pic,
                isSuperAdmin: user.isSuperAdmin,
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
                email: user.email,
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