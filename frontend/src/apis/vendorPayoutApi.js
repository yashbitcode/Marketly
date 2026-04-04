import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const VendorPayoutApi = {
    getAll: async (page) =>
        (await axiosClient.get(`${apiEndpoints.vendorPayout.getAll}/${page}`)).data,
    makeTransfer: async (id) =>
        (await axiosClient.post(`${apiEndpoints.vendorPayout.makeTransfer}/${id}`)).data,
    makePayout: async (id) =>
        (await axiosClient.post(`${apiEndpoints.vendorPayout.makePayout}/${id}`)).data,
};

export default VendorPayoutApi;
