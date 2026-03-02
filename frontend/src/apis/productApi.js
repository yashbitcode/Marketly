import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const ProductApi = {
    getAllFilteredProducts: async (filters = {}, page = 1) =>
        await axiosClient.get(apiEndpoints.product.getFiltered + `/${page}`, {
            params: filters,
        }),
};

export default ProductApi;
