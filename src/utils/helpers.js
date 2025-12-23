const crypto = require("node:crypto");
const { TOKEN_LENGTH } = require("./constants");

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

module.exports = {
    generateRandomNumberString,
};
