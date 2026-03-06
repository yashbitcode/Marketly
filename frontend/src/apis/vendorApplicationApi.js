import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const VendorApplicationApi = {
    createVendorApplication: async (payload) =>
        await axiosClient.post(apiEndpoints.vendorApplication.createApplication, payload),
    getAllUserApplications: async () =>
        await axiosClient.get(apiEndpoints.vendorApplication.getAllUserApplications, {
            withCredentials: true,
        }),
};

export default VendorApplicationApi;
