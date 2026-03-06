import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
    withCredentials: true,
});

axiosClient.defaults.withCredentials = true;
// axiosClient.interceptors.request.use((config) => {
//     const token = getAccessToken();

//     if (token) config.headers.Authorization = `Bearer ${token}`;

//     return config;
// });

export default axiosClient;
