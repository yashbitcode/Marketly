import z from "zod";
import {
    MESSAGE_DOC_MODEL_TYPES as NOTIFICATION_DOC_MODEL_TYPES,
    NOTIFICATION_TYPES,
} from "../constants.js";

const addNotificationValidations = z.object({
    receiverId: z
        .string({
            error: (iss) => !iss.input && "Receiver ID is required",
        })
        .refine((val) => REGEX.objectId.test(val), {
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
    data: z.record(z.string(), z.string()).optional(),
});

export { addNotificationValidations };
