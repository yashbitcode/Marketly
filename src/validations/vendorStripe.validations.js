const z = require("zod");
const { BUSINESS_SIZE } = require("../utils/constants");

const createConnectedAccountValidations = z.object({
    email: z
        .email({
            error: (iss) =>
                !iss.input ? "Email is required" : "Invalid email",
        })
        .lowercase()
        .trim(),
    businessCategory: z.string({
        error: (iss) => !iss.input && "Business category is required",
    }),
    businessSize: z.enum(BUSINESS_SIZE),
});

module.exports = {
    createConnectedAccountValidations,
};
