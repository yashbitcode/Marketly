import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const OrderApi = {
    create: async (payload) => (await axiosClient.post(apiEndpoints.order.create, payload)).data,
    getAll: async (page = 1) => (await axiosClient.get(apiEndpoints.order.getAll + `/${page}`)).data,
    getSpecific: async (orderId) => (await axiosClient.get(apiEndpoints.order.specific + `/${orderId}`)).data,
    getAllVendorOrders: async (page = 1) => (await axiosClient.get(apiEndpoints.order.getAllVendorOrders + `/${page}`)).data,
    updateStatus: async (payload) => (await axiosClient.patch(apiEndpoints.order.updateStatus, payload)).data,
}

export default OrderApi;