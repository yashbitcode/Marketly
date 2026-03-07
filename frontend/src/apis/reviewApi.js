import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const ReviewApi = {
    getAll: async (slug, page = 1) =>
        await axiosClient.get(apiEndpoints.review.getAll + `/${slug}/${page}`),
};

export default ReviewApi;
