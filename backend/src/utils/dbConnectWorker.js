require("dotenv").config();
const main = require("../db");

const workerDBConnect = async (workerInitialisationCB) => {
    await main();
    workerInitialisationCB();
};

module.exports = {
    workerDBConnect,
};
