import z from "zod";
import { baseMediaValidations } from "../baseValidations.js";
import { REGEX } from "../constants.js";

const createOrderRefundApplicationValidations = z.object({
    order: z
        .string({
            error: (iss) => !iss.input && "Order ID is required",
        })
        .refine((val) => REGEX.objectId.test(val), {
            message: "Invalid order ID",
        }),
    reason: z
        .string({
            error: (iss) => !iss.input && "Reason is required",
        })
        .min(10, "Minimum length should be 10"),
    attachments: z.array(baseMediaValidations).optional(),
});

export { createOrderRefundApplicationValidations };
