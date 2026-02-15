const { isValidObjectId } = require("mongoose");
const z = require("zod");

const createOrderRefundApplicationValidations = z.object({
    vendor: z
        .string({
            error: (iss) => !iss.input && "Vendor ID is required",
        })
        .refine((val) => isValidObjectId(val), {
            message: "Invalid vendor ID",
        }),
    reason: z
        .string({
            error: (iss) => !iss.input && "Reason is required",
        })
        .min(10, "Minimum length should be 10"),
    attachments: z.array(baseMediaValidations).optional(),
});

module.exports = {
    createOrderRefundApplicationValidations
}