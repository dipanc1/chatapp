const router = require("express").Router();
const signature = require('../modules/signatureCloudinary')

require('dotenv').config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;

// using this API should require authentication
router.get('/', function (req, res) {
  const sig = signature.signatureCloudinary()
  res.json({
    signature: sig.signature,
    timestamp: sig.timestamp,
    cloudname: cloudName,
    apikey: apiKey
  })
})

module.exports = router