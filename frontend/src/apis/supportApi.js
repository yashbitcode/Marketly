import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const SupportApi = {
    createSupportTicket: async (payload) =>
        (await axiosClient.post(apiEndpoints.support.createTicket, payload)).data,
};

export default SupportApi;
