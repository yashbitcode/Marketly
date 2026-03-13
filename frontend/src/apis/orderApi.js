import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const OrderApi = {
    create: async (payload) => (await axiosClient.post(apiEndpoints.order.create, payload)).data,
}

export default OrderApi;