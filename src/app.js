const express = require("express");
const healthRouter = require("./routes/health.routes");

const app = express();

const BASE_ENDPOINT = process.env.BASE_ENDPOINT;

app.use(BASE_ENDPOINT + "/health-check", healthRouter);

module.exports = app;