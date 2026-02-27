import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const UserApi = {
    me: async () =>
        axiosClient.get(apiEndpoints.user.me, { withCredentials: true }),
};

export default UserApi;
