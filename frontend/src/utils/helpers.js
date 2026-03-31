import { deliveryStatusStyles } from "./constants";

export const trimStr = (str = "", length = 10) => {
    return str.length > length ? str.substring(0, length) + "..." : str;
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
};

export const getTotalQuantity = (products) => {
    if (!products || products.length === 0) return 0;
    return products.reduce((sum, p) => sum + (p.quantity || 1), 0);
};

export const getFormatedStr = (str) => {
    if (!str) return "";

    return str
        ?.split(" ")
        .map((el) => el[0].toUpperCase() + el.substring(1))
        ?.join(" ");
};

export const getDeliveryStatusStyle = (status) => {
    return deliveryStatusStyles[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
};

export const getFormattedStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};


export const formatDate = (date, timeSpecific = true) => {
    if(!date) return;
    
    return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric", ...(timeSpecific && {hour: "2-digit", minute: "2-digit"})
  })
}

export const getChatStatusStyle = (status) => {
    const styles = {
        pending: "bg-yellow-100 text-yellow-700",
        accepted: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        ended: "bg-gray-100 text-gray-700",
    };
    return styles[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
};