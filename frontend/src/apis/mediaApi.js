import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const MediaApi = {
    getAuthParams: async (totalCounts) =>
        (await axiosClient.post(apiEndpoints.media.getAuthParams, { totalCounts })).data,
    deleteImages: async (fileIds, path) =>
        (await axiosClient.post(apiEndpoints.media.delete, { fileIds, path })).data,
};

export default MediaApi;
