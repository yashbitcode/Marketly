import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const AuthApi = {
    login: async (creds) => (await axiosClient.post(apiEndpoints.auth.login, creds)).data,
    changePassword: async (creds) =>
        (await axiosClient.post(apiEndpoints.auth.changePassword, creds)).data,
    vendorLogin: async (creds) =>
        (await axiosClient.post(apiEndpoints.auth.vendorLogin, creds)).data,
    superAdminLogin: async (creds) =>
        (await axiosClient.post(apiEndpoints.auth.superAdminLogin, creds)).data,
    register: async (creds) => (await axiosClient.post(apiEndpoints.auth.register, creds)).data,
    logout: async () => (await axiosClient.post(apiEndpoints.auth.logout)).data,
    forgotPasswordLink: async (payload) =>
        (await axiosClient.post(apiEndpoints.auth.forgotPasswordLink, payload)).data,
    verifyForgotPasswordToken: async (token) =>
        (await axiosClient.get(apiEndpoints.auth.forgotPassword + `/${token}`)).data,
    resetPassword: async (token, payload) =>
        (await axiosClient.post(apiEndpoints.auth.resetPassword + `/${token}`, payload)).data,
    verifyEmailSession: async (sessionId) =>
        (await axiosClient.get(apiEndpoints.auth.verifyEmail + `/${sessionId}`)).data,
    verifyEmailToken: async (sessionId, token) =>
        (await axiosClient.get(apiEndpoints.auth.verifyEmailCode + `/${sessionId}/${token}`)).data,
};

export default AuthApi;
