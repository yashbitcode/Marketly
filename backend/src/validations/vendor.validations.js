import z from "zod";
import { ACCOUNT_STATUS } from "../utils/constants.js";
import { isValidObjectId } from "mongoose";
import { baseVendor } from "../utils/baseValidations.js";

const createVendorValidations = baseVendor
    .extend({
        // userRefId: z
        //     .string({
        //         error: (iss) => !iss.input && "User ID is required",
        //     })
        //     .refine((val) => isValidObjectId(val), {
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
            .refine((val) => isValidObjectId(val), {
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
