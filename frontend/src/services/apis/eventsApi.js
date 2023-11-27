import BaseApi from "./baseApi";

class EventsApi extends BaseApi {
    constructor() {
        super();
        this.baseURL += "/events";
    }

    editEvent(id, data, config) {
        try {
            return this.put(`/edit/${id}`, data, config);
        } catch (error) {
            console.log(error);
        }
    }

    getEvents(data, config) {
        try {
            return this.get(`/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    getAllEvents(data, config) {
        try {
            return this.get(`/all/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    getUpcomingEvents(data, config) {
        try {
            return this.get(`/upcoming/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    getPastEvents(data, config) {
        try {
            return this.get(`/past/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    deleteEvent(id, chatId, config) {
        try {
            return this.delete(`/delete/${id}/${chatId}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    addEvent(chatId, data, config) {
        try {
            return this.put(`/${chatId}`, data, config);
        } catch (error) {
            console.log(error);
        }
    }

    disableEvent(id, config) {
        try {
            return this.put(`/disable/${id}`, {}, config);
        } catch (error) {
            console.log(error);
        }
    }

}


const eventsApi = new EventsApi();

export default eventsApi;