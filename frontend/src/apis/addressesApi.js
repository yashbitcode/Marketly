import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const AddressesApi = {
    getAll: async () => await axiosClient.get(apiEndpoints.addresses.getAll),
    add: async (payload) => await axiosClient.post(apiEndpoints.addresses.add, payload),
    markDefault: async (addressId) =>
        await axiosClient.patch(`${apiEndpoints.addresses.markDefault}/${addressId}`),
    update: async (addressId, payload) =>
        await axiosClient.patch(`${apiEndpoints.addresses.update}/${addressId}`, payload),
    delete: async (addressId) =>
        await axiosClient.delete(`${apiEndpoints.addresses.delete}/${addressId}`),
};

export default AddressesApi;
