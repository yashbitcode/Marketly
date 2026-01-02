const { isValidObjectId } = require("mongoose");
const z = require("zod");

const addProductReviewValidations = z.object({
    user: z
        .string({
            error: (iss) => !iss.input && "User ID is required",
        })
        .refine((val) => isValidObjectId(val), {
            message: "Invalid user ID",
        }),
    product: z
        .string({
            error: (iss) => !iss.input && "Product ID is required",
        })
        .refine((val) => isValidObjectId(val), {
            message: "Invalid product ID",
        }),
    ratings: z
        .number({
            error: (iss) => !iss.input && "Ratings are required",
        })
        .min(1, "Minimum rating should be 1")
        .max(5, "Maximum rating can be 5"),
    heading: z
        .string({
            error: (iss) => !iss.input && "Heading is required",
        })
        .min(5, "Minimum length should be 5"),
    comment: z
        .string({
            error: (iss) => !iss.input && "Comment is required",
        })
        .min(5, "Minimum length should be 5"),
});

module.exports = {
    addProductReviewValidations
};