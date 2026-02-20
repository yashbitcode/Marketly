import "dotenv/config"
import main from "../db/index.js";

const workerDBConnect = async (workerInitialisationCB) => {
    await main();
    workerInitialisationCB();
};

export {
    workerDBConnect,
};
