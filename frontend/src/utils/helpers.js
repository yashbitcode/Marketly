export const trimStr = (str = "", length = 10) => {
    return str.length > length ? str.substring(0, length) + "..." : str;
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
};

export const getFormatedStr = (str) => {
    if (!str) return "";

    return str
        ?.split(" ")
        .map((el) => el[0].toUpperCase() + el.substring(1))
        ?.join(" ");
};

export const formatDate = (date, timeSpecific = true) => {
    if(!date) return;
    
    return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric", ...(timeSpecific && {hour: "2-digit", minute: "2-digit"})
  })
}