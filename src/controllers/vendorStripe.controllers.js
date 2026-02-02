const stripeService = require("../services/stripe.service");
const ApiError = require("../utils/api-error");
const ApiResponse = require("../utils/api-response");
const { asyncHandler } = require("../utils/asyncHandler");

const createStripeConnectedAcc = asyncHandler(async () => {
    const vendor = req.user.vendorId;
    const detailsPayload = req.body;

    const account = await stripeService(vendor, detailsPayload);

    if(!account) throw new ApiError();

    await stripeService.updatePayoutSchedule(account.id);

    res.json(
        new ApiResponse(
            201,
            account,
            "Stripe connected account created successfully",
        ),
    );
});

const getStripeOnboardingLink = asyncHandler(async () => {
    const { stripeAccountId, stripeAccountOnboarded } = req.user.vendorId;

    if(!stripeAccountId) throw new ApiError(400, "Stripe account ID not found");
    if(stripeAccountOnboarded) throw new ApiError(400, "Account already onboarded");

    const onboardLink = await stripeService.getOnboardingLink(stripeAccountId);

    res.json(new ApiResponse(200, {onboardLink}))
});

module.exports = {
    createStripeConnectedAcc,
    getStripeOnboardingLink
};
