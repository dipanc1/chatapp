const backend_url = 'https://chatapp.wildcrypto.com';  // only https is supported
// const backend_url = 'http://localhost:8000'; // it doesn't work with http

const cloudName = 'dipanc1';
const pictureUpload = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
const stripePublicKey = 'pk_live_51N136dLHtaKT8adLWUXk47jhkVHamgXVLXBS5vFbdIwQG01AsuW1F6WklizqXGnX0i9vs4JljRnmW3c8sGxZXVd400btdszLTs'
const stripePublicKeyLive = 'pk_test_51N136dLHtaKT8adL3kfRwpts2g1xBKHE9A1flPHC1eE5rQzHZHO6NcdCNZEmuQWJ2lZiqMJ0hdeqRUdWvaWnVkaa000amUm8tU'

export { backend_url, pictureUpload, stripePublicKey, stripePublicKeyLive };