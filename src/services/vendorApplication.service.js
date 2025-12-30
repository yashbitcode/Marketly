const { GENERAL_USER_FIELDS } = require("../utils/constants");
const vendorService = require("./vendor.service");
const userService = require("./user.service");

class VendorApplicationService {
    async getAll() {
        const allApplications = await VendorApplication.find({}).populate("user", GENERAL_USER_FIELDS);

        return allApplications;
    } 

    async createVendorAndUpdateUser(vendorApplication) {
        const {user, vendorType, avatar, storeName, fullname, accountStatus, phoneNumber} = vendorApplication;

        const vendor = await vendorService.insertVendor({
            vendorType,
            avatar,
            storeName,
            fullname,
            accountStatus,
            phoneNumber,
        });

        if(!vendor) throw new ApiError(); 

        const mainUser = await userService.updateUserData(user, {vendorId: vendor._id}, GENERAL_USER_FIELDS);

        if(!mainUser) throw new ApiError();

        return {
            user: mainUser,
            vendor
        };
    }
}

module.exports = VendorApplicationService;