const bcrypt = require("bcrypt");
const User = require("../models/user.models");

class SuperAdminService {
    async createSuperAdmin(payload) {
        const { email, password } = payload;

        const superAdmin = new User({
            fullname: process.env.SUPER_ADMIN_NAME,
            email,
            password,
            username: "super_admin",
            role: "super-admin",
            phoneNumber: process.env.SUPER_ADMIN_PHONE_NUMBER,
            isEmailVerified: true,
        });

        return superAdmin;
    }

    async verifyLoginDetails(email, password) {
        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
        const superAdminPasswordHash = process.env.SUPER_ADMIN_PASSWORD_HASH;

        const isPasswordCorrect = await bcrypt.compare(
            password,
            superAdminPasswordHash,
        );

        if (email !== superAdminEmail || !isPasswordCorrect) return false;

        return true;
    }

    async getSuperAdmin(filter, fieldsSelection = {}) {
        const superAdmin = await User.findOne(filter).select(fieldsSelection);

        return superAdmin;
    }
}

module.exports = new SuperAdminService();

// SuperAdmin@12
