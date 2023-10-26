import BaseApi from "./baseApi";

class DonationApi extends BaseApi {
    constructor() {
        super();
        this.baseURL += "/donations";
    }


    startDonation(data, config) {
        try {
            return this.post("", data, config);
        } catch (error) {
            console.log(error);
        }
    }

    getDonationOfAnEvent(eventId, config) {
        try {
            return this.get(`/event/${eventId}`, config);
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


const donationApi = new DonationApi();

export default donationApi;