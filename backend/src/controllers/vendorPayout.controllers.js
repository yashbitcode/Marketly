import stripeService from "../services/stripe.service.js";
import vendorPayoutService from "../services/vendorPayout.service.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllVendorPayouts = asyncHandler(async (req, res) => {
    const { data, totalCount } = await vendorPayoutService.getAll();

    res.json(
        new ApiResponse(
            200,
            { vendorPayouts: data, totalCount },
            "Vendor payouts fetched successfully",
        ),
    );
});

const getSpecificVendorPayout = asyncHandler(async (req, res) => {
    const { vendorPayoutId } = req.params;

    if (!vendorPayoutId)
        throw new ApiError(404, "Vendor payout ID is required");

    const vendorPayout = await vendorPayoutService.getSpecific({
        _id: vendorPayoutId,
    });

    if (!vendorPayout) throw new ApiError(400, "Vendor payout not found");

    res.json(
        new ApiResponse(
            200,
            vendorPayout,
            "Vendor payout fetched successfully",
        ),
    );
});

const makeTransfer = asyncHandler(async (req, res) => {
    const { vendorPayoutId } = req.params;

    if (!vendorPayoutId)
        throw new ApiError(404, "Vendor payout ID is required");

    const vendorPayout =
        await vendorPayoutService.getSpecificForAmount(vendorPayoutId);

    if (!vendorPayout) throw new ApiError(400, "Vendor payout not found");

    if (vendorPayout?.order?.refundApplication)
        throw new ApiError(404, "This order have refund application");

    const transfer = await stripeService.makePaymentTransfer(
        vendorPayoutId,
        vendorPayout.amount,
        vendorPayout.vendor.stripeAccountId,
    );

    res.json(new ApiResponse(201, transfer, "Transfer is made successfully"));
});

const makePayout = asyncHandler(async (req, res) => {
    const { vendorPayoutId } = req.params;

    if (!vendorPayoutId)
        throw new ApiError(404, "Vendor payout ID is required");

    const vendorPayout =
        await vendorPayoutService.getSpecificForAmount(vendorPayoutId);

    if (!vendorPayout) throw new ApiError(400, "Vendor payout not found");

    if (vendorPayout.order.refundApplication)
        throw new ApiError(404, "This order have refund application");

    const payout = await stripeService.makePayout(
        vendorPayoutId,
        vendorPayout.amount,
        vendorPayout.vendor.stripeAccountId,
    );

    res.json(new ApiResponse(201, payout, "Payout is made successfully"));
});

export {
    getAllVendorPayouts,
    getSpecificVendorPayout,
    makeTransfer,
    makePayout,
};
