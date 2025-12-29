const crypto = require("node:crypto");
const { TOKEN_LENGTH } = require("./constants");
const slugify = require("slugify");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");

const generateRandomNumberString = () => {
    let result = "";
    const chars = "0123456789";

    const randomArray = new Uint8Array(TOKEN_LENGTH);
    crypto.getRandomValues(randomArray);

    randomArray.forEach((num) => {
        result += chars[num % chars.length];
    });

    return result;
};

const generateSlug = (title) => {
    if (!title) return "";

    return slugify(title, {
        lower: true,
        strict: false,
    });
};

const generateUniqueSlug = (title) => {
    if (!title) return "";

    return (
        slugify(title, {
            lower: true,
            strict: false,
        }) +
        "-" +
        nanoid(6)
    );
};

const generateBaseTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    return {
        accessToken,
        refreshToken,
    };
};

module.exports = {
    generateRandomNumberString,
    generateSlug,
    generateUniqueSlug,
    generateBaseTokens
};
