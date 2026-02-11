const orderService = require("../services/order.service");
const orderRefundApplicationService = require("../services/orderRefundApplication.service");
const ApiResponse = require("../utils/api-response");
const { asyncHandler } = require("../utils/asyncHandler");

const createRefundApplication = asyncHandler(async (req, res) => {
    const { order, reason, attachments, status } = req.body;

    const baseOrder = orderService.getBaseOrder({user: req.user._id, _id: order});

    if(!baseOrder) throw new ApiError(404, "Order not found");
    if(baseOrder.status !== "paid" || !baseOrder.paymentId) throw new ApiError(400, "Invalid refund application");

    const application = await orderRefundApplicationService.createApplication({
        user: req.user._id,
        order,
        reason,
        attachments,
        status,
    });

    res.json(new ApiResponse(201, application, "Refund application created"));
});

const getAllRefundApplications = asyncHandler(async (req, res) => {
    const { page } = req.params;

    const allApplications = await orderRefundApplicationService.getAll(
        {},
        page,
    );

    res.json(new ApiResponse(200, allApplications));
});

// const markRefunded = asyncHandler(async (req, res) => {
//     const { orderApplicationId } = req.params;

//     const application = await orderRefundApplicationService.updateApplication(
//         { _id: orderApplicationId },
//         { status: "refunded" },
//     );

//     res.json(
//         new ApiResponse(
//             200,
//             application,
//             "Application marked refunded successfully",
//         ),
//     );
// });

module.exports = {
    createRefundApplication,
    getAllRefundApplications,
};
