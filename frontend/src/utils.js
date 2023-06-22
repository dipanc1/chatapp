import axios from "axios";
import { backend_url } from "./baseApi";
import jwt_decode from "jwt-decode";

const user = JSON.parse(localStorage.getItem("user"));

export const refreshTokens = async () => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    await axios.post(`${backend_url}/users/token`, {
        token: user.refreshToken,
    }, config)
        .then((res) => {
            localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => {
            localStorage.removeItem("user");
        });
};

const axiosJwt = axios.create({
    baseURL: backend_url,
});

// axiosJwt.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             const refreshToken = user.refreshToken;
//             const decodedRefreshToken = jwt_decode(refreshToken);
//             if (decodedRefreshToken.exp * 1000 < Date.now()) {
//                 localStorage.removeItem("user");
//                 return;
//             }
//             await refreshTokens();
//             return axiosJwt(originalRequest);
//         }
//         return Promise.reject(error);
//     }
// );


axiosJwt.interceptors.request.use(
    async (config) => {
        const token = user.token;
        const refreshToken = user.refreshToken;
        const decodedToken = jwt_decode(token);
        const decodedRefreshToken = jwt_decode(refreshToken);
        if (decodedToken.exp * 1000 < Date.now()) {
            if (decodedRefreshToken.exp * 1000 < Date.now()) {
                localStorage.removeItem("user");
                return;
            }
            await refreshTokens();
        }
        config.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("user")).token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosJwt;