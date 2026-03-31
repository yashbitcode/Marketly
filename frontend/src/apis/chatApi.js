import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const ChatApi = {
    createChatRequest: async (payload) => (await axiosClient.post(apiEndpoints.chat.createChatRequest, payload)).data,
    updateChatRequest: async (payload) => (await axiosClient.patch(apiEndpoints.chat.updateChatRequest, payload)).data,
    getMessages: async (chatId) => (await axiosClient.get(apiEndpoints.chat.getMessages + `/${chatId}`)).data,
    getAllChatsReqs: async (page = 1) => (await axiosClient.get(apiEndpoints.chat.getAllChatsReqs + `/${page}`)).data,
}

export default ChatApi;