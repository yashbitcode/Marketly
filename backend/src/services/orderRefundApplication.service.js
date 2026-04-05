import OrderRefundApplication from "../models/orderRefundApplication.models.js";
import { GENERAL_USER_FIELDS } from "../../../shared/constants.js";
import { getPaginationBasePipeline } from "../utils/helpers.js";

class OrderRefundApplicationService {
    async createApplication(payload) {
        const { user, order, reason, attachments, status } = payload;
        const application = new OrderRefundApplication({
            user,
            order,
            reason,
            attachments,
            status,
        });

        await application.save();

        return application;
    }

    async getOrderRefundApplication(applicationId) {
        const application = await OrderRefundApplication.findById(applicationId).populate({
            path: "order",
            populate: {
                path: "user",
                select: GENERAL_USER_FIELDS,
            },
        });
        return application;
    }

    async updateApplication(filters = {}, payload = {}) {
        const updatedApplication =
            await OrderRefundApplication.findOneAndUpdate(filters, payload, {
                new: true,
                runValidators: true,
            });

        return updatedApplication;
    }

    async getAll(matchStage = {}, page = 1) {
        const basePagination = getPaginationBasePipeline(+page);

        const allApplications = await OrderRefundApplication.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendor",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "order",
                    foreignField: "_id",
                    as: "order",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: GENERAL_USER_FIELDS,
                        },
                    ],
                },
            },
            {
                $addFields: {
                    vendor: { $arrayElemAt: ["$vendor", 0] },
                    user: { $arrayElemAt: ["$user", 0] },
                    order: { $arrayElemAt: ["$order", 0] },
                },
            },
            ...basePagination,
        ]);

        return allApplications;
    }
}

export default new OrderRefundApplicationService();
