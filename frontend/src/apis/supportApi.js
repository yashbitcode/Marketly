import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const SupportApi = {
    createSupportTicket: async (payload) => {
        console.log(payload);
        return await axiosClient.post(apiEndpoints.support.createTicket, payload, {
            withCredentials: true,
        });
    },
};

export default SupportApi;
