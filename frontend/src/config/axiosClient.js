import axios from "axios";
import { getAccessToken } from "../utils/helpers";

const axiosClient = axios.create({
    baseURL: "http://localhost:8000/api/v1",
});

axiosClient.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

export default axiosClient;
