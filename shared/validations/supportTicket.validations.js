import z from "zod";
import { ALLOWED_FILETYPES, SUPPORT_QUERY_TYPES } from "../constants.js";
import { baseMediaValidations } from "../baseValidations.js";

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
    attachments: z
        .array(baseMediaValidations)
        .min(1, "Minimum 1 attachment required")
        .optional(),
});

const addSupportTicketClient = addSupportTicketValidations
    .extend({
        files: z
            .custom((val) => {
                if (typeof window === "undefined") return true;
                if (!val) return true;

                return val instanceof FileList;
            }, "Invalid file type")
            .refine((files) => Array.from(files).length <= 5, {
                message: "At max 5 attachments can be there",
            })
            .refine(
                (files) =>
                    Array.from(files).every((file) =>
                        ALLOWED_FILETYPES.includes(file.type),
                    ),
                {
                    message:
                        "Invalid file type. Only JPG, JPEG, PNG & WEBP are accepted.",
                },
            )
            .optional(),
    })
    .omit({
        attachments: true,
    });

export { addSupportTicketValidations, addSupportTicketClient };
