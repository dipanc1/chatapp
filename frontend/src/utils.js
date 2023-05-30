import axios from "axios";
import { backend_url } from "./baseApi";

const user = JSON.parse(localStorage.getItem("user"));

export const refreshToken = async () => {
    try {
        const res = await axios.post(`${backend_url}/users/token`, { token: user.refreshToken });
        localStorage.setItem("user", JSON.stringify(res.data));
        return res.data;
    } catch (err) {
        console.log(err);
    }
};