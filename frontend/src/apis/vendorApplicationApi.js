import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const VendorApplicationApi = {
    createVendorApplication: async (payload) =>
        (await axiosClient.post(apiEndpoints.vendorApplication.createApplication, payload)).data,
    getAllUserApplications: async () =>
        (await axiosClient.get(apiEndpoints.vendorApplication.getAllUserApplications)).data,
    getAllApplications: async (page = 1) =>
        (await axiosClient.get(apiEndpoints.vendorApplication.getAll + `/${page}`)).data,
    updateStatus: async (applicationId, payload) =>
        (await axiosClient.patch(apiEndpoints.vendorApplication.updateStatus + `/${applicationId}`, payload)).data,
};

export default VendorApplicationApi;
