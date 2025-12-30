const z = require("zod");
const { VENDOR_APPLICATION_STATUS } = require("../utils/constants");
const { baseVendor } = require("../utils/baseValidations");

const createVendorApplicationValidations = baseVendor.extend({
    description: z.string().min(10, "Minimum length should be 10").optional()
});

const updateVendorApplicationValidations = z
    .object({
        applicationStatus: z.enum(VENDOR_APPLICATION_STATUS, {
            message: "Invalid application status",
        }),
        remarks: z.string().min(10, "Minimum length should be 10"),
    })
    .strict();

module.exports = {
    createVendorApplicationValidations,
    updateVendorApplicationValidations,
};
