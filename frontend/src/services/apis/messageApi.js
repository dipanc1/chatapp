import BaseApi from "./baseApi";

class MessageApi extends BaseApi {
    constructor() {
        super();
        this.baseURL += "/message";
    }


    sendMessage(data, config) {
        try {
            return this.post("", data, config);
        } catch (error) {
            console.log(error);
        }
    }

    fetchMessages(chatId, config) {
        try {
            return this.get(`/${chatId}/1`, config);
        } catch (error) {
            console.log(error);
        }
    }

    fetchMoreMessages(chatId, page, config) {
        try {
            return this.get(`/${chatId}/${page}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    readMessages(data, config) {
        try {
            return this.post(`/read`, data, config);
        } catch (error) {
            console.log(error);
        }
    }

}


const messageApi = new MessageApi();

export default messageApi;