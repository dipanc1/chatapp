import BaseApi from './baseApi';

class DonationApi extends BaseApi {
    constructor() {
        super();
        this.baseURL += '/donations';
    }

    startDonation(data, config) {
        try {
            return this.post('', data, config);
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

    getDonationOfAGroup(groupId, config) {
        try {
            return this.get(`/group/${groupId}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    contributeToDonation(donationId, data, config) {
        try {
            return this.put(`/${donationId}`, data, config);
        } catch (error) {
            console.log(error);
        }
    }
}

const donationApi = new DonationApi();

export default donationApi;
