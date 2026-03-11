import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const UserApi = {
    me: async () => (await axiosClient.get(apiEndpoints.user.me)).data,
    updateUser: async (payload) =>
        (await axiosClient.patch(apiEndpoints.user.updateUser, payload)).data,
};

export default UserApi;
