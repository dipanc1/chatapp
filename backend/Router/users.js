const router = require("express").Router();

const bcrypt = require("bcrypt");

const generateToken = require("../config/generateToken");
const { protect } = require("../middleware/authMiddleware");

const { accountSID, authToken, serviceSID } = require("../config/otp_auth");
const client = require("twilio")(accountSID, authToken);

const Chat = require("../models/Conversation");
const User = require("../models/User");


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
        console.log(newUser)

        //save user and send response
        const user = await newUser.save();
        console.log(user)
        res.status(200).json({
            _id: user._id,
            username: user.username,
            number: user.number,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
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

        // send res
        res.status(200).json({
            _id: user._id,
            username: user.username,
            number: user.number,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id)
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

// search query for users and groups  exclusing user logged in
router.get("/", protect, async (req, res) => {
    try {
        const users = await User.find({
            $or: [{ username: { $regex: req.query.search, $options: "i" } }]
        }).find({ _id: { $ne: req.user._id } })
        const groups = await Chat.find({
            $or: [{ chatName: { $regex: req.query.search, $options: "i" } }]
        }).find({ isGroupChat: true, _id: { $ne: req.user._id } })
        res.status(200).json({
            users: users,
            groups: groups
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


module.exports = router;