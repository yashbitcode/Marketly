require("dotenv").config();
const app = require("./app.js");
const connectDB = require("./db/index");

const PORT = process.env.PORT ?? 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log("Server up and running on PORT " + PORT));
    })
    .catch(() => {
        console.log("Unable to run the server");
        process.exit(1);
    });
