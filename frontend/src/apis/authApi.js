import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const AuthApi = {
    login: async (creds) =>
        await axiosClient.post(apiEndpoints.auth.login, creds, {
            withCredentials: true,
        }),
    vendorLogin: async (creds) =>
        await axiosClient.post(apiEndpoints.auth.vendorLogin, creds),
    superAdminLogin: async (creds) =>
        await axiosClient.post(apiEndpoints.auth.superAdminLogin, creds),
    register: async (creds) =>
        await axiosClient.post(apiEndpoints.auth.register, creds),
    logout: async () => await axiosClient.post(apiEndpoints.auth.logout),
    forgotPasswordLink: async (payload) =>
        await axiosClient.post(apiEndpoints.auth.forgotPasswordLink, payload),
    verifyForgotPasswordToken: async (token) =>
        await axiosClient.get(apiEndpoints.auth.forgotPassword + `/${token}`),
    resetPassword: async (token, payload) =>
        await axiosClient.post(
            apiEndpoints.auth.resetPassword + `/${token}`,
            payload,
        ),
    verifyEmailSession: async (sessionId) =>
        axiosClient.get(apiEndpoints.auth.verifyEmail + `/${sessionId}`),
    verifyEmailToken: async (sessionId, token) =>
        axiosClient.get(
            apiEndpoints.auth.verifyEmailCode + `/${sessionId}/${token}`,
        ),
};

export default AuthApi;
