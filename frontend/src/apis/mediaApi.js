import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const MediaApi = {
    getAuthParams: async (totalCounts) =>
        await axiosClient.post(apiEndpoints.media.getAuthParams, { totalCounts }),
};

export default MediaApi;
