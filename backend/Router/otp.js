const router = require("express").Router();
const { accountSID, authToken, serviceSID } = require("../config/otp_auth")
const client = require("twilio")(accountSID, authToken);

router.post("/mobile", (req, res) => {
    console.log("number", req.body.number);
    client.verify
        .services(serviceSID)
        .verifications.create({
            to: req.body.number,
            channel: "sms",
        })
        .then((resp) => {
            console.log("response", resp);
            res.status(200).json(resp);
        })
        .catch((err) => {
            console.log("err", err);
            res.status(500).json(err);
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