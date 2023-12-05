import BaseApi from "./baseApi";

class PostApi extends BaseApi {
    constructor() {
        super();
        this.baseURL += "/posts";
    }

    createPost(chatId, data, config) {
        try {
            return this.post(`/${chatId}`, data, config);
        } catch (error) {
            console.log(error);
        }
    }

    editPost(id, chatId, body, config) {
        try {
            return this.put(`/edit/${id}/${chatId}`, body, config);
        } catch (error) {
            console.log(error);
        }
    }

    getAllPosts(data, config) {
        try {
            return this.get(`/all/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    deletePost(id, chatId, config) {
        try {
            return this.delete(`/delete/${id}/${chatId}`, config);
        } catch (error) {
            console.log(error);
        }
    }

}


const postApi = new PostApi();

export default postApi;
