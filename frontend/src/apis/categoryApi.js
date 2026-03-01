import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const CategoryApi = {
    getAllCategories: async () =>
        await axiosClient.get(apiEndpoints.category.getAll),
};

export default CategoryApi;
