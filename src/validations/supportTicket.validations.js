const z = require("zod");
const { SUPPORT_QUERY_TYPES } = require("../utils/constants");

const addSupportTicketValidations = z.object({
    fullname: z
        .string({
            error: (iss) => !iss.input && "Fullname is required",
        })
        .min(3, "Minimum length should be 3"),
    email: z
        .email({
            error: (iss) =>
                !iss.input ? "Email is required" : "Invalid email",
        })
        .lowercase()
        .trim(),
    queryType: z.enum(SUPPORT_QUERY_TYPES, "Invalid query type"),
    message: z
        .string({
            error: (iss) => !iss.input && "Message is required",
        })
        .min(10, "Minimum length should be 10"),
    attachments: z.array(z.string()).min(1, "Minimum 1 attachment required").optional()
});

module.exports = {
    addSupportTicketValidations
};
