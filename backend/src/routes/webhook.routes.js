import express from "express";
import { Router } from "express";
import { Stripe } from "stripe";
import vendorPayoutService from "../services/vendorPayout.service.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = Router();

router.post(
    "/",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const endpointSecretPlatform =
            process.env.STRIPE_WEBHOOK_SECRET_PLATFORM;
        const endpointSecretConnect = process.env.STRIPE_WEBHOOK_SECRET_CONNECT;

        let event;
        const signature = req.headers["stripe-signature"];

        const payload = req.body.toString();
        const payloadObj = JSON.parse(payload);

        try {
            if (payloadObj && payloadObj.event === "transfer.created") {
                event = stripe.webhooks.constructEvent(
                    payload,
                    signature,
                    endpointSecretConnect,
                );
            } else {
                event = stripe.webhooks.constructEvent(
                    payload,
                    signature,
                    endpointSecretPlatform,
                );
            }
        } catch (err) {
            console.log(`Webhook signature verification failed.`, err.message);
            return res.sendStatus(400);
        }

        const { metadata, id } = payloadObj.data.object;

        if (event.type === "payout.paid") {
            await vendorPayoutService.updateVendorPayout(
                metadata.vendorPayoutId,
                { isPaid: true, payoutId: id },
            );
        } else if (event.type === "transfer.created") {
            await vendorPayoutService.updateVendorPayout(
                metadata.vendorPayoutId,
                { transfer: id },
            );
        }

        res.send();
    },
);

export default router;
