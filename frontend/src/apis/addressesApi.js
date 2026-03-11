import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const AddressesApi = {
    getAll: async () => (await axiosClient.get(apiEndpoints.addresses.getAll)).data,
    add: async (payload) => (await axiosClient.post(apiEndpoints.addresses.add, payload)).data,
    markDefault: async (addressId) =>
        (await axiosClient.patch(`${apiEndpoints.addresses.markDefault}/${addressId}`)).data,
    update: async (addressId, payload) =>
        (await axiosClient.patch(`${apiEndpoints.addresses.update}/${addressId}`, payload)).data,
    delete: async (addressId) =>
        (await axiosClient.delete(`${apiEndpoints.addresses.delete}/${addressId}`)).data,
};

export default AddressesApi;
