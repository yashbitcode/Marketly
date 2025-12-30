const z = require("zod");
const { ACCOUNT_STATUS } = require("../utils/constants");
const { isValidObjectId } = require("mongoose");
const { baseVendor } = require("../utils/baseValidations");

const createVendorValidations = baseVendor
    .extend({
        // userRefId: z
        //     .string({
        //         error: (iss) => !iss.input && "User ID is required",
        //     })
        //     .refine((val) => isValidObjectId(val), {
        //         message: "Invalid user ID",
        //     }),
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
