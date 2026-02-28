import {
    Anvil,
    ChartSpline,
    Facebook,
    FingerprintPattern,
    IndianRupee,
    Twitter,
} from "lucide-react";
import authApi from "../apis/authApi";

export const baseBackendURL = "http://localhost:8000/api/v1";

export const preventNumInp = ["e", "-", "."];

export const preventKeys = ["ArrowRight", "ArrowLeft", "Backspace"];

export const apiEndpoints = {
    auth: {
        login: "/auth/login",
        vendorLogin: "/auth/vendor-login",
        superAdminLogin: "/auth/super-admin-login",
        forgotPassword: "/auth/forgot-password",
        resetPassword: "/auth/reset-password",
        register: "/auth/register",
        logout: "/auth/logout",
        verifyEmail: "/auth/verify-email",
        verifyEmailCode: "/auth/verify-email-code",
        changePassword: "/auth/change-password",
        forgotPasswordLink: "/auth/forgot-password-link",
    },
    user: {
        me: "/me",
    },
};

export const VENDOR_FEATURES = [
    {
        title: "Wider Customer Reach",
        desc: "Reach thousands of active buyers",
        icon: ChartSpline,
    },
    {
        title: "Higher Sales Potential",
        desc: "Increase revenue with smart promotions",
        icon: Anvil,
    },
    {
        title: "Build Your Brand",
        desc: "Grow your store and loyal audience",
        icon: FingerprintPattern,
    },
    {
        title: "Secure Payments",
        desc: "Fast and reliable payouts",
        icon: IndianRupee,
    },
];

export const SOCIAL_MEDIA = [
    {
        icon: Twitter,
        bgColor: "bg-[#1ea0f3]",
    },
    {
        icon: Facebook,
        bgColor: "bg-[#3c5996]",
    },
];

export const FOOTER_LINKS = {
    information: [
        {
            title: "About Us",
            href: "/",
        },
        {
            title: "Delivery Info",
            href: "/",
        },
        {
            title: "Privacy Policy",
            href: "/",
        },
        {
            title: "Terms & Conditions",
            href: "/",
        },
        {
            title: "Become Seller",
            href: "/",
        },
    ],
    quickLinks: [
        {
            title: "Returns & Exchanges",
            href: "/",
        },
        {
            title: "Return Center",
            href: "/",
        },
        {
            title: "Purchase History",
            href: "/",
        },
        {
            title: "Latest News",
            href: "/",
        },
        {
            title: "Sell Products",
            href: "/",
        },
    ],
};

export const AUTH_CHOICE = {
    login: {
        leftHead: "Your marketplace, your way",
        leftDesc:
            "Sign in to continue shopping, track orders, and manage your profile effortlessly",
        rightHead: "Welcome Back",
        rightDesc: "Please Login To Your Account",
        api: authApi.login,
    },
    "vendor-login": {
        leftHead: "Power your store with confidence",
        leftDesc:
            "Manage inventory, process orders, and grow your brand in one place.",
        rightHead: "Welcome back, Vendor",
        rightDesc: "Sign in to access your dashboard and manage your store.",
        api: authApi.vendorLogin,
    },

    "admin-login": {
        leftHead: "Marketplace control center",
        leftDesc:
            "Monitor vendors, track activity, and scale operations smoothly.",
        rightHead: "Admin Access Portal",
        rightDesc: "Log in to manage platform operations and analytics.",
        api: authApi.superAdminLogin,
    },
    "forgot-password": {
        leftHead: "Forgot your password?",
        leftDesc:
            "No worries. Enter your email and we’ll help you get back into your account",
        rightHead: "Recover Access",
        rightDesc: "Get Forgot Password Link On Your Email...",
        // api: authApi.forgotPasswordLink,
    },

    "reset-password": {
        leftHead: "Reset Your Password?",
        leftDesc: "No worries. Enter Your New Password",
        rightHead: "Set New Password",
        rightDesc: "Get Your New Password Now...",
        // api: authApi.resetPassword,
    },
};
