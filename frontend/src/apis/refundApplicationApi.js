import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const RefundApplicationApi = {
    create: async (payload) => (await axiosClient.post(apiEndpoints.orderRefundApplication.create, payload)).data,
    getAll: async (page = 1) => (await axiosClient.get(apiEndpoints.orderRefundApplication.getAll + `/${page}`)).data,
    getSpecificApplication: async (applicationId) => (await axiosClient.get(apiEndpoints.orderRefundApplication.getAll + `/application/${applicationId}`)).data,
    processRefund: async (applicationId) => (await axiosClient.post(apiEndpoints.orderRefundApplication.getAll + `/process/${applicationId}`)).data,
};

export default RefundApplicationApi;
