const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


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
        })
        console.log(newUser)

        //save user and send response
        const user = await newUser.save();
        console.log(user)
        res.status(200).json(user)

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
        res.status(200).json({ _id: user._id, username: user.username })


    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
})

//get user
router.get("/", async(req, res) => {
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

module.exports = router;