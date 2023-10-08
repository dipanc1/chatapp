import axios from "axios";
import { backend_url } from "../../utils";



export default class BaseApi {
    constructor() {
        this.baseURL = backend_url;
    }

    url = (url) => {
        return `${this.baseURL}${url}`;
    };

    async getWithoutAuth(url) {
        return await axios.get(this.url(url));
    }

    async postWithoutAuth(url, data) {
        return await axios.post(this.url(url), data);
    }

    async putWithoutAuth(url, data) {
        return await axios.put(this.url(url), data);
    }

    async deleteWithoutAuth(url) {
        return await axios.delete(this.url(url));
    }

    async get(url, config) {
        return await axios.get(this.url(url), config);
    }

    async post(url, data, config) {
        return await axios.post(this.url(url), data, config);
    }

    async put(url, data, config) {
        return await axios.put(this.url(url), data, config);
    }

    async delete(url, config) {
        return await axios.delete(this.url(url), config);
    }

    sendOtpOnPhoneNumber(data) {
        try {
            this.postWithoutAuth("/mobile", data);
        } catch (error) {
            console.log(error);
        }
    }

    verifyOtp(data) {
        try {
            this.postWithoutAuth("/otp", data);
        } catch (error) {
            console.log(error);
        }
    }

} 