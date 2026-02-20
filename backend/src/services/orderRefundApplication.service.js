import OrderRefundApplication from "../models/orderRefundApplication.models.js";
import { GENERAL_USER_FIELDS } from "../utils/constants.js";

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
                },
            },
            ...basePagination,
        ]);

        return allApplications;
    }
}

export default new OrderRefundApplicationService();
