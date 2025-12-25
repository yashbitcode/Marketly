const express = require("express");
const healthRouter = require("./routes/health.routes");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const addressRouter = require("./routes/address.routes");
const { BASE_ENDPOINT } = require("./utils/constants");
const { handleError } = require("./middlewares/errorHandling.middlewares");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(BASE_ENDPOINT + "/health-check", healthRouter);
app.use(BASE_ENDPOINT + "/auth", authRouter);
app.use(BASE_ENDPOINT + "/user", userRouter);
app.use(BASE_ENDPOINT + "/address", addressRouter);

app.use(handleError);

module.exports = app;
