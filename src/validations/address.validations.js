const { isValidObjectId } = require("mongoose");

const addAddressValidations = z
    .object({
        // userId: z
        //     .string({
        //         error: (iss) => !iss.input && "User ID is required",
        //     })
        //     .refine((val) => isValidObjectId(val), {
        //         message: "Invalid user ID",
        //     }),
        fullname: z
            .string({
                error: (iss) => !iss.input && "Fullname is required",
            })
            .min(3, "Minimum length should be 3"),
        phoneNumber: z
            .string({
                error: (iss) => !iss.input && "Phone number is required",
            })
            .regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number"),
        addressLine1: z.string({
            error: (iss) => !iss.input && "Address Line is required",
        }),

        addressLine2: z
            .string()
            .min(10, "Minimum length should be 10")
            .optional(),
        city: z.string({
            error: (iss) => !iss.input && "City is required",
        }),
        state: z.string({
            error: (iss) => !iss.input && "State is required",
        }),
        postalCode: z.string({
            error: (iss) => !iss.input && "Postal code is required",
        }),
        country: z.string({
            error: (iss) => !iss.input && "Country is required",
        }),
        addressType: z
            .enum(["home", "work", "other"], "Invalid address type")
            .optional(),
    })
    .strict();

module.exports = {
    addAddressValidations,
};
