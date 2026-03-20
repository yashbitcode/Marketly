import z from "zod";
import { REGEX } from "../constants.js";
import { baseMediaValidations, clientSideFileValidations } from "../baseValidations.js";

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
    file: clientSideFileValidations(1)
        .optional(),
});

export { updateUserValidations, updateUserClient };
