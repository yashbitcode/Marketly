import orderService from "../services/order.service.js";
import orderRefundApplicationService from "../services/orderRefundApplication.service.js";
import razorpayService from "../services/razorpay.service.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createRefundApplication = asyncHandler(async (req, res) => {
    const { order, reason, attachments } = req.body;

    const baseOrder = await orderService.getBaseOrder({
        user: req.user._id,
        _id: order,
    });

    if (!baseOrder) throw new ApiError(404, "Order not found");
    if (baseOrder.status !== "paid" || !baseOrder.paymentId)
        throw new ApiError(400, "Invalid refund application");
    if(baseOrder.refundApplication) throw new ApiError(400, "Refund application already exists");
    if(baseOrder.deliveryStatus === "returned") throw new ApiError(400, "Order is already returned");
    if((new Date() - baseOrder.createdAt) > 7 * 24 * 60 * 60 * 1000) throw new ApiError(400, "Order is older than 7 days");

    const application = await orderRefundApplicationService.createApplication({
        user: req.user._id,
        order,
        reason,
        attachments,
    });

    await orderService.updateParentOrder({
        _id: order,
    }, {
        refundApplication: application._id,
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

const makeRefund = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    const application = await orderRefundApplicationService.getOrderRefundApplication(applicationId);

    if(!application) throw new ApiError(404, "Application not found");
    

    const refund = await razorpayService.refundAmount(application.order.paymentId, application.order.amount, {refundId: applicationId, orderDocId: application.order._id});

    res.json(
        new ApiResponse(
            200,
            refund,
            "Application marked refunded successfully",
        ),
    );
});

const getSpecificApplication = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    const application = await orderRefundApplicationService.getOrderRefundApplication(applicationId);

    if(!application) throw new ApiError(404, "Application not found");

    res.json(new ApiResponse(200, application));
});

export { createRefundApplication, getAllRefundApplications, makeRefund, getSpecificApplication };
