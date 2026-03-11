import {
    Anvil,
    ChartSpline,
    Facebook,
    FingerprintPattern,
    IndianRupee,
    Twitter,
} from "lucide-react";

export const preventNumInp = ["e", "-", ".", "E"];

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
    vendorApplication: {
        createApplication: "/vendor-application/me",
        getAllUserApplications: "/vendor-application/me",
    },
    user: {
        me: "/me",
        updateUser: "/user",
    },
    category: {
        getAll: "/category/all",
    },
    addresses: {
        getAll: "/address",
        add: "/address",
        update: "/address",
        delete: "/address",
        markDefault: "address/default",
    },
    product: {
        getFiltered: "/product/filter",
        specific: "/product/slug",
    },
    review: {
        getAll: "/review/product",
        add: "/review/product",
    },
    media: {
        getAuthParams: "/media",
    },
    support: {
        createTicket: "/support",
    },
};

export const tabs = ["Description", "Vendor", "Reviews"];

export const loadingMessages = [
    "Preparing amazing deals for you...",
    "Loading fresh products...",
    "Fetching trending items...",
    "Setting up your shopping experience...",
    "Organizing the best picks...",
    "Checking the latest arrivals...",
    "Almost ready with your favorites...",
    "Bringing the marketplace to you...",
    "Loading smart shopping tools...",
    "Finding products you'll love...",
    "Updating prices and offers...",
    "Gathering top-rated products...",
    "Preparing secure checkout...",
    "Syncing your cart...",
    "Loading exclusive discounts...",
    "Curating something special...",
    "Warming up the storefront...",
    "Checking inventory status...",
    "Personalizing your experience...",
    "Almost there, Marketly is getting ready...",
];

export const TOKEN_LENGTH = 6;

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
        api: (creds) => import("../apis").then((m) => m.AuthApi.login(creds)),
    },
    "vendor-login": {
        leftHead: "Power your store with confidence",
        leftDesc: "Manage inventory, process orders, and grow your brand in one place.",
        rightHead: "Welcome back, Vendor",
        rightDesc: "Sign in to access your dashboard and manage your store.",
        api: (creds) => import("../apis").then((m) => m.AuthApi.vendorLogin(creds)),
    },

    "admin-login": {
        leftHead: "Marketplace control center",
        leftDesc: "Monitor vendors, track activity, and scale operations smoothly.",
        rightHead: "Admin Access Portal",
        rightDesc: "Log in to manage platform operations and analytics.",
        api: (creds) => import("../apis").then((m) => m.AuthApi.superAdminLogin(creds)),
    },
    "forgot-password": {
        leftHead: "Forgot your password?",
        leftDesc: "No worries. Enter your email and we’ll help you get back into your account",
        rightHead: "Recover Access",
        rightDesc: "Get Forgot Password Link On Your Email...",
        // api: AuthApi.forgotPasswordLink,
    },

    "reset-password": {
        leftHead: "Reset Your Password?",
        leftDesc: "No worries. Enter Your New Password",
        rightHead: "Set New Password",
        rightDesc: "Get Your New Password Now...",
        // api: AuthApi.resetPassword,
    },
};
