import z from "zod";
import { REGEX } from "../utils/constants.js";
import { baseMediaValidations } from "../utils/baseValidations.js";

const updateUserValidations = baseMediaValidations
    .extend({
        fullname: z.string().min(3, "Minimum length should be 3"),
        phoneNumber: z
            .string()
            .regex(REGEX.phoneNumber, "Invalid Phone Number"),
        avatar: baseMediaValidations,
    })
    .partial();

export { updateUserValidations };
