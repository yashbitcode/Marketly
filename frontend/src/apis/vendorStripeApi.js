import axiosClient from "../config/axiosClient";

const vendorStripeApi = {
    createConnectedAccount: async (payload) =>
        (await axiosClient.post("/vendor-stripe/connected-account", payload)).data,
    getOnboardingLink: async () => 
        (await axiosClient.get("/vendor-stripe/onboard-link")).data,
    getLoginLink: async () => 
        (await axiosClient.get("/vendor-stripe/login-link")).data,
};

export default vendorStripeApi;
