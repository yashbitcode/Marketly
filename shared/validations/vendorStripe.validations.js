import z from "zod";
import { BUSINESS_SIZE } from "../constants.js";

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

export { createConnectedAccountValidations };
