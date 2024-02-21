import BaseApi from './baseApi';

class AuthApi extends BaseApi {
    constructor() {
        super();
        this.baseURL += '/users';
    }

    login(data) {
        try {
            return this.postWithoutAuth('/login', data);
        } catch (error) {
            console.log(error);
        }
    }

    register(data) {
        try {
            return this.postWithoutAuth('/register', data);
        } catch (error) {
            console.log(error);
        }
    }

    forgotPasswordCheckOtpChangePassword(data) {
        try {
            return this.postWithoutAuth(
                '/forget-password-check-otp-change-password',
                data,
            );
        } catch (error) {
            console.log(error);
        }
    }

    forgotPasswordCheckPassword(data) {
        try {
            return this.postWithoutAuth('/forget-password-check-number', data);
        } catch (error) {
            console.log(error);
        }
    }

    forgotPasswordCheckPasswordEmail(data) {
        try {
            return this.postWithoutAuth('/forget-password-check-email', data);
        } catch (error) {
            console.log(error);
        }
    }

    checkIfUserNameExists(data) {
        try {
            return this.getWithoutAuth(`/check-username/${data}`);
        } catch (error) {
            console.log(error);
        }
    }

    userInfo(config) {
        try {
            return this.get('/user-info', config);
        } catch (error) {
            console.log(error);
        }
    }

    searchUser(data, config) {
        try {
            return this.get(`?search=${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }
}

const authApi = new AuthApi();

export default authApi;
