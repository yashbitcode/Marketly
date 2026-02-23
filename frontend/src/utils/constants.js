import {
    Anvil,
    ChartSpline,
    Facebook,
    FingerprintPattern,
    IndianRupee,
    Twitter,
} from "lucide-react";

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
    },
    "vendor-login": {
        leftHead: "Power your store with confidence",
        leftDesc:
            "Manage inventory, process orders, and grow your brand in one place.",
        rightHead: "Welcome back, Vendor",
        rightDesc: "Sign in to access your dashboard and manage your store.",
    },

    "admin-login": {
        leftHead: "Marketplace control center",
        leftDesc:
            "Monitor vendors, track activity, and scale operations smoothly.",
        rightHead: "Admin Access Portal",
        rightDesc: "Log in to manage platform operations and analytics.",
    },
    "forgot-password": {
        leftHead: "Forgot your password?",
        leftDesc:
            "No worries. Enter your email and we’ll help you get back into your account",
        rightHead: "Recover Access",
        rightDesc: "Get Forgot Password Link On Your Email...",
    },

    "reset-password": {
        leftHead: "Reset Your Password?",
        leftDesc: "No worries. Enter Your New Password",
        rightHead: "Set New Password",
        rightDesc: "Get Your New Password Now...",
    },
};
