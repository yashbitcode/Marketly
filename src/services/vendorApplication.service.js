const { GENERAL_USER_FIELDS, PAGINATION_LIMIT } = require("../utils/constants");
const vendorService = require("./vendor.service");
const userService = require("./user.service");
const VendorApplication = require("../models/vendorApplication.models");

class VendorApplicationService {
    async getAll(filters, page) {
        const allApplications = await VendorApplication.find(filters).populate(
            "user",
            GENERAL_USER_FIELDS,
        ).skip(PAGINATION_LIMIT * (page - 1))
            .limit(PAGINATION_LIMIT).sort({
                createdAt: -1
            });

        return allApplications;
    }

    async getUserApplications(userId) {
        const allApplications = await VendorApplication.find({user: userId}).populate("vendor");
        
        return allApplications;
    }

    async createApplication(userId, payload) {
        const {
            vendorType,
            avatar,
            fullname,
            storeName,
            phoneNumber,
            description
        } = payload;

        const application = new VendorApplication({
            user: userId,
            vendorType,
            avatar,
            fullname,
            storeName,
            phoneNumber,
            description
        });

        await application.save();

        return application;
    }

    async createVendorAndUpdateUser(vendorApplication) {
        const {
            user,
            vendorType,
            avatar,
            storeName,
            fullname,
            phoneNumber,
        } = vendorApplication;

        const vendor = await vendorService.insertVendor({
            vendorType,
            avatar,
            storeName,
            fullname,
            phoneNumber,
            accountStatus: "active"
        });

        if (!vendor) throw new ApiError();

        const mainUser = await userService.updateUserData(
            user,
            { vendorId: vendor._id },
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

module.exports = new VendorApplicationService();
