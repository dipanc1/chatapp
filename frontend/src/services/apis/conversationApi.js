import BaseApi from './baseApi';

class ConversationApi extends BaseApi {
    constructor() {
        super();
        this.baseURL += '/conversation';
    }

    getOneOnOne(data, config) {
        try {
            return this.get(`/one-on-one/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    getGroupChats(data, config) {
        try {
            return this.get(`/group-chats/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    getEncryptedChatUrl(data, config) {
        try {
            return this.get(`/encrypted/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    getConversationDetailWithEncryptedUrl(data) {
        try {
            return this.getWithoutAuth(`/encrypted/chat/${data}`);
        } catch (error) {
            console.log(error);
        }
    }

    accessConversation(data, config) {
        try {
            return this.post('', data, config);
        } catch (error) {
            console.log(error);
        }
    }

    getChatWithId(data, config) {
        try {
            return this.get(`/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    renameConversation(data, config) {
        try {
            return this.put('/rename', data, config);
        } catch (error) {
            console.log(error);
        }
    }

    createAGroup(data, config) {
        try {
            return this.post('/group', data, config);
        } catch (error) {
            console.log(error);
        }
    }

    addToGroup(data, config) {
        try {
            return this.put('/groupadd', data, config);
        } catch (error) {
            console.log(error);
        }
    }

    removeFromGroup(data, config) {
        try {
            return this.put('/groupremove', data, config);
        } catch (error) {
            console.log(error);
        }
    }

    changeGroupAdmin(data, config) {
        try {
            return this.put('/groupmakeadmin', data, config);
        } catch (error) {
            console.log(error);
        }
    }

    suspendGroup(data, config) {
        try {
            return this.put('/groupsuspend', data, config);
        } catch (error) {
            console.log(error);
        }
    }

    fetchGroupWhereAdmin(data, config) {
        try {
            return this.get(`/admin/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    fetchGroupWhereIamPart(data, config) {
        try {
            return this.get(`/my/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    fetchGroups(data, config) {
        try {
            return this.get(`/all/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    checkStream(data, config) {
        try {
            return this.get(`/streaming/${data}`, config);
        } catch (error) {
            console.log(error);
        }
    }

    stopStream(data, config) {
        try {
            return this.put(`/stop-stream`, data, config);
        } catch (error) {
            console.log(error);
        }
    }

    startStream(data, config) {
        try {
            return this.put(`/stream`, data, config);
        } catch (error) {
            console.log(error);
        }
    }
}

const conversationApi = new ConversationApi();

export default conversationApi;
