import express from "express";
import { Router } from "express";
import { Stripe } from "stripe";
import vendorPayoutService from "../services/vendorPayout.service.js";
import vendorService from "../services/vendor.service.js";
import Vendor from "../models/vendor.models.js";
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

        console.log(payload)
// transfer.created -> endpointSecretPlatform, payout.paid -> endpointSecretConnect
        try {
            if (payloadObj && (payloadObj.type === "transfer.created")) {
                console.log("ACCCC")
                event = stripe.webhooks.constructEvent(
                    payload,
                    signature,
                    endpointSecretPlatform,
                );
            } else {
                console.log("KKkk")
                event = stripe.webhooks.constructEvent(
                    payload,
                    signature,
                    endpointSecretConnect,
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
            console.log("transFER");

            const ab = await vendorPayoutService.updateVendorPayout(
                metadata.vendorPayoutId,
                { transferId: id });

            console.log(ab)
        } else if (event.type === "account.updated" && event?.data?.object?.charges_enabled) {
            const account = event.data.object;

            console.log(account);
            if (account.details_submitted) {
                const vendor = await Vendor.findOne({ stripeAccountId: account.id });
                if (vendor && !vendor.stripeAccountOnboarded) {
                    await vendorService.updateVendorDetails(vendor._id, {
                        stripeAccountOnboarded: true,
                    });
                }
            }
        }

        res.send();
    },
);

export default router;
