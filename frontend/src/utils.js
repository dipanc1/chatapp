import { AUDIO, DOC, FILE, IMAGE, PDF, PPT, TXT, VIDEO, XLS } from "./constants";

// local server
// const backend_url = 'http://localhost:8000';

// abhishek's server
const backend_url = 'https://app.fundsdome.com';

// local peer server
// const peer_server_url = 'http://localhost:8080';

// abhishek's peer server
const peer_server_url = 'https://peerjs.fundsdome.com';

const cloudName = 'dipanc1';
const pictureUpload = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
const uploadFile = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
const api_key = '835688546376544';
const upload_preset = 'chat-app';
const folder = 'uploads';

const stripePublicKey = 'pk_live_51N136dLHtaKT8adLWUXk47jhkVHamgXVLXBS5vFbdIwQG01AsuW1F6WklizqXGnX0i9vs4JljRnmW3c8sGxZXVd400btdszLTs';
const stripePublicKeyLive = 'pk_test_51N136dLHtaKT8adL3kfRwpts2g1xBKHE9A1flPHC1eE5rQzHZHO6NcdCNZEmuQWJ2lZiqMJ0hdeqRUdWvaWnVkaa000amUm8tU';

const emailjsServiceId = 'service_ef2nk5k';
const emailjsTemplateId = 'template_for_chatapp';
const emailjsUserId = 'user_V88xEHCgH913EFMNqxCRw';

const trackingId = "G-RQ7Z6QSMZF";


const checkFileExtension = (url) => {
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg')) {
        return IMAGE;
    }
    if (url.includes('.mp4') || url.includes('.mov') || url.includes('.avi') || url.includes('.mkv')) {
        return VIDEO;
    }
    if (url.includes('.mp3') || url.includes('.wav') || url.includes('.aac') || url.includes('.flac')) {
        return AUDIO;
    }
    if (url.includes('.pdf')) {
        return PDF;
    }
    if (url.includes('.doc') || url.includes('.docx')) {
        return DOC;
    }
    if (url.includes('.xls') || url.includes('.xlsx')) {
        return XLS;
    }
    if (url.includes('.ppt') || url.includes('.pptx')) {
        return PPT;
    }
    if (url.includes('.txt')) {
        return TXT;
    }
    if (url.includes('.zip') || url.includes('.rar') || url.includes('.tar') || url.includes('.gz') || url.includes('.ini') || ((url.split('.').slice(-3)[2] !== undefined) && url.startsWith('http'))
    ) {
        return FILE;
    }
}

const typeArray = [IMAGE, VIDEO, AUDIO, PDF, DOC, XLS, PPT, TXT, FILE];


export { backend_url, pictureUpload, stripePublicKey, stripePublicKeyLive, api_key, upload_preset, emailjsServiceId, emailjsTemplateId, emailjsUserId, folder, trackingId, checkFileExtension, uploadFile, typeArray, peer_server_url };