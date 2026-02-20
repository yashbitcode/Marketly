import z from "zod";
import { VENDOR_APPLICATION_STATUS } from "../utils/constants.js";
import { baseVendor } from "../utils/baseValidations.js";

const createVendorApplicationValidations = baseVendor.extend({
    description: z.string().min(10, "Minimum length should be 10").optional(),
});

const updateVendorApplicationValidations = z
    .object({
        applicationStatus: z.enum(VENDOR_APPLICATION_STATUS, {
            message: "Invalid application status",
        }),
        remarks: z.string().min(10, "Minimum length should be 10"),
    })
    .strict();

export {
    createVendorApplicationValidations,
    updateVendorApplicationValidations,
};
