import z from "zod";
import {
    MESSAGE_DOC_MODEL_TYPES,
    PRODUCT_APPROVAL_STATUS as APPROVAL_STATUS,
    REGEX,
} from "../constants.js";
import { baseMediaValidations } from "../baseValidations.js";

const createChatReqValidations = z.object({
    vendor: z
        .string({
            error: (iss) => !iss.input && "Vendor ID is required",
        })
        .refine((val) => REGEX.objectId.test(val), {
            message: "Invalid vendor ID",
        }),
});

const updateChatReqStatusValidations = z.object({
    chatReqId: z
        .string({
            error: (iss) => !iss.input && "Chat request ID is required",
        })
        .refine((val) => REGEX.objectId.test(val), {
            message: "Invalid chat request ID",
        }),
    status: z.enum(APPROVAL_STATUS, "Invalid status"),
});

const createMessageValidations = z.object({
    senderId: z
        .string({
            error: (iss) => !iss.input && "Sender ID is required",
        })
        .refine((val) => REGEX.objectId.test(val), {
            message: "Invalid sender ID",
        }),
    docModel: z.enum(MESSAGE_DOC_MODEL_TYPES, "Invalid address type"),
    message: z.string({
        error: (iss) => !iss.input && "Message is required",
    }),
    chatId: z.string({
        error: (iss) => !iss.input && "Chat ID is required",
    }),
    // attachments: z
    //     .array(baseMediaValidations)
    //     .min(1, "Minimum 1 attachment required")
    //     .optional(),
});

export {
    createChatReqValidations,
    updateChatReqStatusValidations,
    createMessageValidations,
};
