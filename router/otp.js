const router = require("express").Router();

require("dotenv").config();

const accountSID = process.env.OTP_ACCOUNT_SID;
const authToken = process.env.OTP_AUTH_TOKEN;
const serviceSID = process.env.OTP_SERVICE_SID;

const client = require("twilio")(accountSID, authToken);

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