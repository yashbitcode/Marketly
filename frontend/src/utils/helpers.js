export const trimStr = (str = "", length = 10) => {
    return str.length > length ? str.substring(0, length) + "..." : str;
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
};
