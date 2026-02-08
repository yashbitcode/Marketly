const express = require("express");
const cors = require("cors");
const http = require("node:http");
const { BASE_ENDPOINT } = require("./utils/constants");
const { handleError } = require("./middlewares/errorHandling.middlewares");
const cookieParser = require("cookie-parser");
const { initSocket } = require("./config/socket/socket.manager");
const { setupSocketIO } = require("./config/socket");
const {serve} = require("inngest/express");
const {inngest, functions} = require("./inngest"); 

const app = express();
const httpServer = http.createServer(app);

const io = initSocket(httpServer);
setupSocketIO(io);

const healthRouter = require("./routes/health.routes");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const meRouter = require("./routes/me.routes");
const addressRouter = require("./routes/address.routes");
const categoryRouter = require("./routes/category.routes");
const vendorRouter = require("./routes/vendor.routes");
const vendorApplicationRouter = require("./routes/vendorApplication.routes");
const productRouter = require("./routes/product.routes");
const reviewRouter = require("./routes/review.routes");
const supportTicketRouter = require("./routes/supportTicket.routes");
const mediaRouter = require("./routes/media.routes");
const chatRouter = require("./routes/chat.routes");
const orderRouter = require("./routes/order.routes");
const vendorStripeRouter = require("./routes/vendorStripe.routes");
const vendorPayoutRouter = require("./routes/vendorPayout.routes");
const webhookRouter = require("./routes/webhook.routes");
// const inngestRouter = require("./routes/inngest.routes");

app.use(cors());

app.use(BASE_ENDPOINT + "/webhook", webhookRouter);

app.use(express.json());
app.use(cookieParser());

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.use(BASE_ENDPOINT + "/health-check", healthRouter);
app.use(BASE_ENDPOINT + "/auth", authRouter);
app.use(BASE_ENDPOINT + "/user", userRouter);
app.use(BASE_ENDPOINT + "/me", meRouter);
app.use(BASE_ENDPOINT + "/address", addressRouter);
app.use(BASE_ENDPOINT + "/category", categoryRouter);
app.use(BASE_ENDPOINT + "/vendor", vendorRouter);
app.use(BASE_ENDPOINT + "/vendor-application", vendorApplicationRouter);
app.use(BASE_ENDPOINT + "/product", productRouter);
app.use(BASE_ENDPOINT + "/review", reviewRouter);
app.use(BASE_ENDPOINT + "/support", supportTicketRouter);
app.use(BASE_ENDPOINT + "/media", mediaRouter);
app.use(BASE_ENDPOINT + "/chat", chatRouter);
app.use(BASE_ENDPOINT + "/order", orderRouter);
app.use(BASE_ENDPOINT + "/vendor-stripe", vendorStripeRouter);
app.use(BASE_ENDPOINT + "/vendor-payout", vendorPayoutRouter);
app.use("/api/inngest", serve({ client: inngest, functions }));
// app.use(BASE_ENDPOINT + "/inngest", inngestRouter);

app.use(handleError);

module.exports = httpServer;
