import z from "zod";
import { ALLOWED_FILETYPES, REGEX } from "../constants.js";
import { baseMediaValidations } from "../baseValidations.js";

const updateUserValidations = z
    .object({
        fullname: z.string().min(3, "Minimum length should be 3"),
        phoneNumber: z
            .string()
            .regex(REGEX.phoneNumber, "Invalid Phone Number"),
        avatar: baseMediaValidations,
    })
    .partial();

const updateUserClient = updateUserValidations.extend({
    file: z
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
});

export { updateUserValidations, updateUserClient };
