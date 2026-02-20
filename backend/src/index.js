import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT ?? 8000;

connectDB()
    .then(() => {
        console.log("MongoDB connection established");
        app.listen(PORT, () =>
            console.log("Server up and running on PORT " + PORT),
        );
    })
    .catch(() => {
        console.log("Unable to run the server");
        process.exit(1);
    });
