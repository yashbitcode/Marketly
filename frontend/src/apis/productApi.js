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
    getAll: async (page = 1) =>
        (await axiosClient.get(apiEndpoints.product.getAll + `/${page}`)).data,
    getCartProducts: async (payload) =>
        (await axiosClient.post(apiEndpoints.product.cart, {products: payload})).data,
    addProduct: async (payload) =>
        (await axiosClient.post(apiEndpoints.product.create, payload)).data,
    updateProduct: async (slug, payload) => (await axiosClient.patch(apiEndpoints.product.update + `/${slug}`, payload)).data,
};

export default ProductApi;
