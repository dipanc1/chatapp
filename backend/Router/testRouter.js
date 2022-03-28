const router = require("express").Router();
const { accoutnSID, authToken, serviceSID } = require("../config/otp_auth")
const client = require("twilio")(accoutnSID, authToken);

router.post("/mobile", (req, res) => {
    console.log("number", req.body.number);
    client.verify
        .services(serviceSID)
        .verifications.create({
            to: `+91${req.body.number}`,
            channel: "sms",
        })
        .then((resp) => {
            console.log("response", resp);
            res.status(200).json(resp);
        });
});

router.post("/otp", (req, res) => {
    const { OTP, number1 } = req.body;
    console.log("otp", OTP);
    console.log("number", `+91${number1.number}`);
    client.verify.services(serviceSID)
        .verificationChecks
        .create({
            to: `+91${number1.number}`,
            code: OTP,
        })
        .then((resp) => {
            console.log("otp res", resp);
            if (resp.valid) {
                res.json({ resp, message: "Welcome" });
            }
            res.json({ resp, message: "Expire Otp" });
        });
});

module.exports = router;