const z = require("zod");
const { VENDOR_TYPE, ACCOUNT_STATUS, REGEX } = require("../utils/constants");
const { isValidObjectId } = require("mongoose");

const baseVendor = z.object({
    vendorType: z.enum(VENDOR_TYPE, "Invalid vendor type"),
    avatar: z
        .url({
            error: (iss) =>
                !iss.input ? "Avatar URL is required" : "Invalid avatar URL",
        })
        .optional(),
    storeName: z
        .string({
            error: (iss) => !iss.input && "Store name is required",
        })
        .min(3, "Minimum length should be 3")
        .max(20, "Maximum length can be 20"),
    fullname: z
        .string({
            error: (iss) => !iss.input && "Fullname is required",
        })
        .min(3, "Minimum length should be 3"),
    phoneNumber: z
        .string({
            error: (iss) => !iss.input && "Phone number is required",
        })
        .regex(REGEX.phoneNumber, "Invalid phone number"),
});

const createVendorValidations = baseVendor
    .extend({
        userRefId: z
            .string({
                error: (iss) => !iss.input && "User ID is required",
            })
            .refine((val) => isValidObjectId(val), {
                message: "Invalid user ID",
            }),
        accountStatus: z.enum(ACCOUNT_STATUS, "Invalid account status"),
    })
    .strict();

const updateVendorAccStatusValidations = z
    .object({
        vendorId: z
            .string({
                error: (iss) => !iss.input && "User ID is required",
            })
            .refine((val) => isValidObjectId(val), {
                message: "Invalid user ID",
            }),
        accountStatus: z.enum(ACCOUNT_STATUS, "Invalid account status"),
    })
    .strict();

const updateVendorValidations = baseVendor.partial();

module.exports = {
    createVendorValidations,
    updateVendorValidations,
    updateVendorAccStatusValidations,
};
