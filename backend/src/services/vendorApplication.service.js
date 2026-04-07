import { GENERAL_USER_FIELDS } from "shared/constants.js";
import vendorService from "./vendor.service.js";
import userService from "./user.service.js";
import VendorApplication from "../models/vendorApplication.models.js";
import { getPaginationBasePipeline } from "../utils/helpers.js";

class VendorApplicationService {
    async getAll(page) {
        const basePagination = getPaginationBasePipeline(+page);

        const [allApplications] = await VendorApplication.aggregate([
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
                $unwind: "$user",
            },
            ...basePagination,
        ]);

        return allApplications;
    }

    async getUserApplications(userId) {
        const allApplications = await VendorApplication.find({
            user: userId,
        }).populate("vendor");

        return allApplications;
    }

    async createApplication(userId, payload) {
        const {
            vendorType,
            avatar,
            fullname,
            storeName,
            phoneNumber,
            description,
        } = payload;

        const application = new VendorApplication({
            user: userId,
            vendorType,
            avatar,
            fullname,
            storeName,
            phoneNumber,
            description,
        });

        await application.save();

        return application;
    }

    async createVendorAndUpdateUser(vendorApplication) {
        const { user, vendorType, avatar, storeName, fullname, phoneNumber } =
            vendorApplication;

        const vendor = await vendorService.insertVendor({
            vendorType,
            avatar,
            storeName,
            fullname,
            phoneNumber,
            accountStatus: "active",
        });

        if (!vendor) throw new ApiError();

        const mainUser = await userService.updateUserData(
            { _id: user },
            { vendorId: vendor._id, $inc: { tokenVersion: 1 } },
            GENERAL_USER_FIELDS,
        );

        if (!mainUser) throw new ApiError();

        return {
            user: mainUser,
            vendor,
        };
    }

    async updateApplication(filter, payload) {
        const application = await VendorApplication.findOneAndUpdate(
            filter,
            payload,
            {
                new: true,
                runValidators: true,
            },
        );

        return application;
    }
}

export default new VendorApplicationService();
