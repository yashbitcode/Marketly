import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const ProductApi = {
    getAllFilteredProducts: async (filters = {}, page = 1) =>
        (
            await axiosClient.get(apiEndpoints.product.getFiltered + `/${page}`, {
                params: filters,
            })
        ).data,
    getSpecific: async (slug) =>
        (await axiosClient.get(apiEndpoints.product.specific + `/${slug}`)).data,
};

export default ProductApi;
