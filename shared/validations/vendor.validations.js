import z from "zod";
import { ACCOUNT_STATUS } from "../constants.js";
import { baseVendor } from "../baseValidations.js";

const createVendorValidations = baseVendor
    .extend({
        // userRefId: z
        //     .string({
        //         error: (iss) => !iss.input && "User ID is required",
        //     })
        //     .refine((val) => REGEX.objectId.test(val), {
        //         message: "Invalid user ID",
        //     }),
        accountStatus: z.enum(ACCOUNT_STATUS, "Invalid account status"),
    })
    .strict();

const updateVendorAccStatusValidations = z
    .object({
        vendorId: z
            .string({
                error: (iss) => !iss.input && "User ID is required",
            })
            .refine((val) => REGEX.objectId.test(val), {
                message: "Invalid user ID",
            }),
        accountStatus: z.enum(ACCOUNT_STATUS, "Invalid account status"),
    })
    .strict();

const updateVendorValidations = baseVendor.partial();

export {
    createVendorValidations,
    updateVendorValidations,
    updateVendorAccStatusValidations,
};
