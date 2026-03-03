import axios from "axios";
import { getAccessToken } from "../utils/helpers";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

export default axiosClient;
