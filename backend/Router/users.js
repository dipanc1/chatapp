const router = require("express").Router();
const generateToken = require("../config/generateToken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");


// register

router.post("/register", async(req, res) => {
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

router.post("/login", async(req, res) => {
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

//get user which we want to update
router.get("/find", async(req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ?
            await User.findById(userId) :
            await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get users to get users with out current user, search bar api

router.get("/", asyncHandler(async(req, res) => {
    const keyword = req.query.search
    console.log(keyword) ? {
        $or: [
            { username: { $regex: keyword, $options: "i" } },
            { number: { $regex: keyword, $options: "i" } },
        ],
    } : {}

    const users = await User.find({ keyword }).find({ _id: { $ne: req.user._id } })
    res.send(users);
}));

module.exports = router;