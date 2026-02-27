import express from "express";
import cors from "cors";
import http from "node:http";
import { BASE_ENDPOINT } from "../../shared/constants.js";
import { handleError } from "./middlewares/errorHandling.middlewares.js";
import cookieParser from "cookie-parser";
import { initSocket } from "./config/socket/socket.manager.js";
import { setupSocketIO } from "./config/socket/index.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();
const httpServer = http.createServer(app);

const io = initSocket(httpServer);
setupSocketIO(io);

import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import meRouter from "./routes/me.routes.js";
import addressRouter from "./routes/address.routes.js";
import categoryRouter from "./routes/category.routes.js";
import vendorRouter from "./routes/vendor.routes.js";
import vendorApplicationRouter from "./routes/vendorApplication.routes.js";
import productRouter from "./routes/product.routes.js";
import reviewRouter from "./routes/review.routes.js";
import supportTicketRouter from "./routes/supportTicket.routes.js";
import mediaRouter from "./routes/media.routes.js";
import chatRouter from "./routes/chat.routes.js";
import orderRouter from "./routes/order.routes.js";
import vendorStripeRouter from "./routes/vendorStripe.routes.js";
import vendorPayoutRouter from "./routes/vendorPayout.routes.js";
import webhookRouter from "./routes/webhook.routes.js";

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

app.use(BASE_ENDPOINT + "/webhook", webhookRouter);

app.use(express.json());
app.use(cookieParser());

// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/index.html");
// });

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

app.use(handleError);

export default httpServer;
