import stripeService from "../services/stripe.service.js";
import vendorService from "../services/vendor.service.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { pubClient as redisClient } from "../config/redis/connection.js";

const createStripeConnectedAcc = asyncHandler(async (req, res) => {
    const vendor = req.user.vendorId;
    const detailsPayload = req.body;

    const account = await stripeService.createConnectedAccount(
        vendor,
        detailsPayload,
    );

    if (!account) throw new ApiError(500, "Failed to create Stripe account");

    await stripeService.updatePayoutSchedule(account.id);

    const updatedVendor = await vendorService.updateVendorDetails(vendor._id, {
        stripeAccountId: account.id,
    });

    if (!updatedVendor)
        throw new ApiError(500, "Failed to update vendor with Stripe account");

    // Invalidate cache
    await redisClient.del(`vendor:${req.user._id}`);

    res.status(201).json(
        new ApiResponse(
            201,
            account,
            "Stripe connected account created successfully",
        ),
    );
});

const getStripeOnboardingLink = asyncHandler(async (req, res) => {
    const { stripeAccountId, stripeAccountOnboarded } = req.user.vendorId;

    if (!stripeAccountId)
        throw new ApiError(400, "Stripe account ID not found");
    if (stripeAccountOnboarded)
        throw new ApiError(400, "Account already onboarded");

    const onboardLink = await stripeService.getOnboardingLink(stripeAccountId);

    res.json(new ApiResponse(200, { onboardLink }));
});

const checkStripeAccountStatus = asyncHandler(async (req, res) => {
    const { stripeAccountId } = req.user.vendorId;

    if (!stripeAccountId) {
        throw new ApiError(400, "Stripe account ID not found");
    }

    const account = await stripeService.retrieveAccount(stripeAccountId);

    if (account.details_submitted) {
        await vendorService.updateVendorDetails(req.user.vendorId._id, {
            stripeAccountOnboarded: true,
        });

        // Invalidate cache
        await redisClient.del(`vendor:${req.user._id}`);
    }

    res.json(
        new ApiResponse(200, {
            onboarded: account.details_submitted,
            account,
        }, "Account status checked successfully"),
    );
});

export { 
    createStripeConnectedAcc, 
    getStripeOnboardingLink,
    checkStripeAccountStatus
};
