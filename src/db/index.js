const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

async function main() {
    try {
        await mongoose.connect(mongoURI);
    } catch (err) {
        console.log("Unable to estab. connection with mongoDB: " + err);
        process.exit(1);
    }
}

module.exports = main;
