const z = require("zod");
const {
    baseProductValidations,
    baseProductAttributeValidations,
} = require("../utils/baseValidations");
const { PRODUCT_APPROVAL_STATUS } = require("../utils/constants");

const addProductValidations = baseProductValidations
    .extend({
        attributes: baseProductAttributeValidations
            .min(1, "Atleast 1 attribute should be there")
            .optional(),
    })
    .strict();

const updateProductValidations = baseProductValidations
    .extend({
        attributes: baseProductAttributeValidations.min(
            1,
            "Atleast 1 attribute should be there",
        ),
    })
    .partial();

const updateProductStatusValidations = z
    .object({
        status: z.enum(PRODUCT_APPROVAL_STATUS, {
            message: "Invalid status type",
        }),
        remarks: z
            .string({
                error: (iss) => !iss.input && "Remarks are required",
            })
            .min(10, "Minimum length should be 10"),
        isActive: z.boolean({
            error: (iss) => !iss.input && "Active status is required",
        }),
    })
    .superRefine((data, ctx) => {
        const { status, isActive } = data;

        if (status === "rejected" && isActive)
            ctx.addIssue({
                message: "Invalid active flag with respect to status",
                path: ["isActive"],
            });
        else if (status === "accepted" && !isActive)
            ctx.addIssue({
                message: "Invalid active flag with respect to status",
                path: ["isActive"],
            });
    });

module.exports = {
    addProductValidations,
    updateProductValidations,
    updateProductStatusValidations,
};
