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
    notification: {
        getAll: "/notification",
        markAsRead: "/notification",
    },
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
        getAll: "/vendor-application",
        updateStatus: "/vendor-application/vendor-status",
    },
    user: {
        me: "/me",
        updateUser: "/user",
    },
    category: {
        getAll: "/category/all",
        getParent: "/category",
        getSub: "/category/sub",
        addParent: "/category",
        addSub: "/category/sub",
        updateParent: "/category",
        updateSub: "/category/sub",
        deleteParent: "/category",
        deleteSub: "/category/sub",
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
        cart: "/product/cart",
        create: "/product/vendor",
        getAll: "/product",
        update: "/product/vendor",
        updateStatus: "/product/approval"
    },
    review: {
        getAll: "/review/product",
        add: "/review/product",
    },
    order: {
        create: "/order/create-order",
        getAll: "/order",
        specific: "/order/specific",
        getAllVendorOrders: "/order/vendor",
        updateStatus: "/order/delivery-status"
    },
    media: {
        getAuthParams: "/media",
        delete: "/media/files"
    },
    support: {
        createTicket: "/support",
        getAllTickets: "/support",
    },
    chat: {
        createChatRequest: "/chat/user",
        updateChatRequest: "/chat",
        getMessages: "/chat/message",
        getAllChatsReqs: "/chat"
    },
    vendorPayout: {
        getAll: "/vendor-payout",
        makeTransfer: "/vendor-payout/transfer",
        makePayout: "/vendor-payout/payout",
    },
    orderRefundApplication: {
        create: "/order-refund-application",
        getAll: "/order-refund-application",
    }
};

export const typeConfig = {
    ORDER_UPDATE: {
        pill: "bg-orange-100 text-orange-500",
        dot: "bg-orange-500",
        card: "bg-orange-50",
        icon: "🛒",
    },
    CHAT_REQUEST_UPDATE: {
        pill: "bg-blue-100 text-blue-500",
        dot: "bg-blue-500",
        card: "bg-blue-50",
        icon: "💬",
    },
    GENERAL_UPDATE: {
        pill: "bg-gray-100 text-gray-500",
        dot: "bg-gray-500",
        card: "bg-gray-50",
        icon: "🔔",
    },
    DEFAULT: {
        pill: "bg-sky-100 text-sky-500",
        dot: "bg-sky-500",
        card: "bg-sky-50",
        icon: "🔔",
    },
};

export const deliveryStatusStyles = {
    placed: "bg-blue-100 text-blue-700",
    confirmed: "bg-indigo-100 text-indigo-700",
    processing: "bg-yellow-100 text-yellow-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    returned: "bg-orange-100 text-orange-700",
};

export const STATUS_STEPS = [
    { key: "placed", label: "Order Placed" },
    // { key: "confirmed", label: "Confirmed" },
    { key: "shipped", label: "Shipped" },
    { key: "out of delivery", label: "Out Of Delivery" },
    { key: "delivered", label: "Delivered" },
    // { key: "delivered", label: "Returned" },
];

export const STATUS_STYLE = {
    paid: { label: "Paid", bg: "bg-green-100", text: "text-green-700" },
    pending: { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-700" },
    failed: { label: "Failed", bg: "bg-red-100", text: "text-red-600" },
    refunded: { label: "Refunded", bg: "bg-gray-100", text: "text-gray-700" }
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
