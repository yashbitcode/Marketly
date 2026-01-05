const z = require("zod");
const { MESSAGE_DOC_MODEL_TYPES: NOTIFICATION_DOC_MODEL_TYPES, NOTIFICATION_TYPES } = require("../utils/constants");

const addNotificationValidations = z.object({
    receiverId: z
        .string({
            error: (iss) => !iss.input && "Receiver ID is required",
        })
        .refine((val) => isValidObjectId(val), {
            message: "Invalid receiver ID",
        }),
    docModel: z.enum(NOTIFICATION_DOC_MODEL_TYPES, "Invalid address type"),
    notificationType: z.enum(NOTIFICATION_TYPES, "Invalid notification type"),
    title: z.string({
        error: (iss) => !iss.input && "Title is required",
    }),
    message: z.string({
        error: (iss) => !iss.input && "Message is required",
    }),
    data: z.record(z.string(), z.string()).optional()
});

module.exports = {
    addNotificationValidations
}