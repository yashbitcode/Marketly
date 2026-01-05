const z = require("zod");
const { MESSAGE_DOC_MODEL_TYPES, PRODUCT_APPROVAL_STATUS: APPROVAL_STATUS } = require("../utils/constants");
const { baseMediaValidations } = require("../utils/baseValidations");
const { isValidObjectId } = require("mongoose");

const createChatReqValidations = z.object({
    user: z
        .string({
            error: (iss) => !iss.input && "User ID is required",
        })
        .refine((val) => isValidObjectId(val), {
            message: "Invalid user ID",
        }),
    vendor: z
        .string({
            error: (iss) => !iss.input && "Vendor ID is required",
        })
        .refine((val) => isValidObjectId(val), {
            message: "Invalid vendor ID",
        }),
});

const updateChatReqStatusValidations = z.object({
    chatReqId: z
        .string({
            error: (iss) => !iss.input && "Chat request ID is required",
        })
        .refine((val) => isValidObjectId(val), {
            message: "Invalid chat request ID",
        }),
    status: z.enum(APPROVAL_STATUS, "Invalid status")
})

const createMessageValidations = z.object({
    senderId: z
        .string({
            error: (iss) => !iss.input && "Sender ID is required",
        })
        .refine((val) => isValidObjectId(val), {
            message: "Invalid sender ID",
        }),
    docModel: z.enum(MESSAGE_DOC_MODEL_TYPES, "Invalid address type"),
    message: z
        .string({
            error: (iss) => !iss.input && "Message is required",
        })
        .min(1, "Minimum length should be 1"),
    chatId: z.string({
        error: (iss) => !iss.input && "Chat ID is required",
    }),
    attachments: z
        .array(baseMediaValidations)
        .min(1, "Minimum 1 attachment required")
        .optional(),
});

module.exports = {
    createChatReqValidations,
    updateChatReqStatusValidations,
    createMessageValidations
};