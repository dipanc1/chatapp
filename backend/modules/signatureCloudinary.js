const cloudinary = require('cloudinary').v2;

require('dotenv').config();
const apiSecret = process.env.CLOUDINARY_API_SECRET


const signatureCloudinary = () => {
    const timestamp = Math.round((new Date).getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        folder: process.env.CLOUDINARY_FOLDER
    }, apiSecret);

    return { timestamp, signature }
}

module.exports = {
    signatureCloudinary
}
