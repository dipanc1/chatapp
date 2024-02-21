const router = require("express").Router();
const nodemailer = require("nodemailer");

const Otp = require("../models/Otp");
const User = require("../models/User");

require("dotenv").config();

const accountSID = process.env.OTP_ACCOUNT_SID;
const authToken = process.env.OTP_AUTH_TOKEN;
const serviceSID = process.env.OTP_SERVICE_SID;

const service = process.env.NODEMAILER_SERVICE;
const host = process.env.NODEMAILER_HOST;
const user = process.env.NODEMAILER_EMAIL;
const pass = process.env.NODEMAILER_PASS;

const client = require("twilio")(accountSID, authToken);


const transporter = nodemailer.createTransport({
    service,
    host,
    port: 465,
    secure: true,
    auth: {
        user,
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

router.post("/email", async (req, res) => {
    let email = req.body.email;

    if (!email) {
        return res.status(400).json({
            message: "Email is required",
        });
    }

    let user = await User.findOne({
        email,
    });

    if (user) {
        return res.status(400).json({
            message: "Email is already registered",
        });
    }

    const mailOptions = {
        from: user,
        to: email,
        subject: "OTP for verification - ChatApp",
        text: `Your OTP for verification is ${generateOtp(email)}`,
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
});

router.post("/email/verify", async (req, res) => {
    let otp = req.body.otp;
    let email = req.body.email;

    if (!otp) {
        return res.status(400).json({
            message: "OTP is required",
        });
    }

    if (!email) {
        return res.status(400).json({
            message: "Email is required",
        });
    }

    let otpData = await Otp.findOne({ email, otp });

    if (!otpData) {
        return res.status(400).json({
            message: "Invalid OTP",
        });
    }

    await Otp.deleteOne({ email, otp });

    res.status(200).json({
        message: "OTP verified successfully",
    });
});


router.post("/mobile", (req, res) => {
    client.verify
        .services(serviceSID)
        .verifications.create({
            to: req.body.number,
            channel: "sms",
        })
        .then((resp) => {
            console.log("response", resp);
            res.status(200).json({
                message: "OTP sent successfully",
            });
        })
        .catch((err) => {
            console.log("err", err);
            res.status(500).json({
                message: "Error sending OTP",
            });
        });
});

router.post("/otp", (req, res) => {
    const { OTP, number1 } = req.body;
    console.log("otp", OTP);
    console.log("number", number1.number);
    client.verify.services(serviceSID)
        .verificationChecks
        .create({
            to: number1.number,
            code: OTP,
        })
        .then((resp) => {
            console.log("otp res", resp);
            if (resp.valid) {
                res.json({ message: "Welcome" });
            }
            res.json({ message: "Expire Otp" });
        });
});

module.exports = router;