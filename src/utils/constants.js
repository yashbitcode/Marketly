const BASE_ENDPOINT = "/api/v1";

const TOKEN_LENGTH = 6;

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true
};

module.exports = {
    BASE_ENDPOINT,
    TOKEN_LENGTH,
    COOKIE_OPTIONS
};