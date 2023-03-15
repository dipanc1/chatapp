// local server
const backend_url = 'http://localhost:8000';

// staging server
// const backend_url = 'https://chatapphosted.azurewebsites.net';

// abhishek's server
// const backend_url = 'https://chatapp.wildcrypto.com';

const cloudName = 'dipanc1';
const pictureUpload = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

module.exports = {
    backend_url,
    pictureUpload
}