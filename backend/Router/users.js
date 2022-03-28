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
            phonenumber: req.body.phonenumber,
            password: hashedPassword,
        })


        //save user and send response
        const user = await newUser.save();
        res.status(200).json(user._id)

    } catch (err) {
        res.status(500).json(err)
            // console.log(err)
    }
})

//login

router.post("/login", async(req, res) => {
    try {

        // find the user
        const user = await User.findOne({ username: req.body.username, phonenumber: req.body.phonenumber })

        !user && res.status(400).json("Wrong Username or Password")

        // validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("Wrong Username and Password");

        // send res
        res.status(200).json({ _id: user._id, username: user.username })


    } catch (err) {
        res.status(500).json(err)
            // console.log(err)
    }
})

module.exports = router;