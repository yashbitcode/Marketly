const express = require("express");
const healthRouter = require("./routes/health.routes");
const authRouter = require("./routes/auth.routes");
const { BASE_ENDPOINT } = require("./utils/constants");

const app = express();

app.use(express.json());
app.use(BASE_ENDPOINT + "/health-check", healthRouter);
app.use(BASE_ENDPOINT + '/auth', authRouter);

module.exports = app;