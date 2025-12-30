const express = require("express");
const { BASE_ENDPOINT } = require("./utils/constants");
const { handleError } = require("./middlewares/errorHandling.middlewares");
const cookieParser = require("cookie-parser");

const healthRouter = require("./routes/health.routes");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const meRouter = require("./routes/me.routes");
const addressRouter = require("./routes/address.routes");
const categoryRouter = require("./routes/category.routes");
const vendorRouter = require("./routes/vendor.routes");
const vendorApplicationRouter = require("./routes/vendorApplication.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(BASE_ENDPOINT + "/health-check", healthRouter);
app.use(BASE_ENDPOINT + "/auth", authRouter);
app.use(BASE_ENDPOINT + "/user", userRouter);
app.use(BASE_ENDPOINT + "/me", meRouter);
app.use(BASE_ENDPOINT + "/address", addressRouter);
app.use(BASE_ENDPOINT + "/category", categoryRouter);
app.use(BASE_ENDPOINT + "/vendor", vendorRouter);
app.use(BASE_ENDPOINT + "/vendor-application", vendorApplicationRouter);

app.use(handleError);

module.exports = app;
