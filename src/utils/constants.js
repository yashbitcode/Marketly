const BASE_ENDPOINT = "/api/v1";
const TOKEN_LENGTH = 6;
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
};

const ROLES = ["user", "vendor"];
const VENDOR_TYPE = ["individual", "business"];
const DATATYPES = ["string", "number"];
const ADDRESS_TYPE = ["home", "work", "other"];
const ACCOUNT_STATUS = ["pending", "active", "suspended", "banned"];

const REGEX = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    url: /^(https?:\/\/)?[da-z.-]+.([a-z.]{2,6})([\/w .-]*)*\/?$/,
    username: /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/,
    phoneNumber: /^\+[1-9]\d{1,14}$/,
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
};

module.exports = {
    BASE_ENDPOINT,
    TOKEN_LENGTH,
    COOKIE_OPTIONS,
    ROLES,
    DATATYPES,
    REGEX,
    ADDRESS_TYPE,
    VENDOR_TYPE,
    ACCOUNT_STATUS
};
