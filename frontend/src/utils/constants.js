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

export const LOGIN_CHOICE = {
    user: {
        head: "Your marketplace, your way",
        desc: "Sign in to continue shopping, track orders, and manage your profile effortlessly",
        sideTag: "Welcome Back",
        sideDesc: "Please Login To Your Account",
    },
    vendor: {
        head: "Power your store with confidence",
        desc: "Manage inventory, process orders, and grow your brand — all in one place",
        sideTag: "",
        sideDesc: "",
    },
    admin: {
        head: "Marketplace control center",
        desc: "Monitor activity, manage vendors, and scale operations with precision",
        sideTag: "",
        sideDesc: "",
    },
};
