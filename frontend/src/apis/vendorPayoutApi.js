import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const VendorPayoutApi = {
    getAll: async () =>
        (await axiosClient.get(apiEndpoints.vendorPayout.getAll)).data,
};

export default VendorPayoutApi;
