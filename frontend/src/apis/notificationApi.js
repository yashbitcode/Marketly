import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const NotificationApi = {
    getAll: async () => (await axiosClient.get(apiEndpoints.notification.getAll)).data,
    markAsRead: async (notificationId) => (await axiosClient.patch(apiEndpoints.notification.markAsRead + `/${notificationId}`)).data,
}

export default NotificationApi;