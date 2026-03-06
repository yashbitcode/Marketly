import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const UserApi = {
    me: async () => axiosClient.get(apiEndpoints.user.me),
    updateUser: async (payload) =>
        axiosClient.patch(apiEndpoints.user.updateUser, payload, { withCredentials: true }),
};

export default UserApi;
