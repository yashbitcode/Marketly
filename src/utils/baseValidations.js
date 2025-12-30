const z = require("zod");
const { REGEX, ADDRESS_TYPE, VENDOR_TYPE } = require("./constants");
const { isValidObjectId } = require("mongoose");
// const { DATATYPES } = require("./constants");

const addressValidations = z.object({
    fullname: z
        .string({
            error: (iss) => !iss.input && "Fullname is required",
        })
        .min(3, "Minimum length should be 3"),
    phoneNumber: z
        .string({
            error: (iss) => !iss.input && "Phone number is required",
        })
        .regex(REGEX.phoneNumber, "Invalid phone number"),
    addressLine1: z.string({
        error: (iss) => !iss.input && "Address Line is required",
    }),

    addressLine2: z.string().min(10, "Minimum length should be 10").optional(),
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
    addressType: z.enum(ADDRESS_TYPE, "Invalid address type").optional(),
});

const parentCategoryValidations = z.object({
    name: z
        .string({
            error: (iss) => !iss.input && "Name is required",
        })
        .min(3, "Minimum length should be 3"),
});

const subCategoryValidations = z.object({
    name: z
        .string({
            error: (iss) => !iss.input && "Name is required",
        })
        .min(3, "Minimum length should be 3"),
    parentCategory: z
        .string({
            error: (iss) => !iss.input && "Parent category ID is required",
        })
        .refine((val) => isValidObjectId(val), {
            message: "Invalid parent category ID",
        }),
    // attributes: z.object({
    //     name: z
    //         .string({
    //             error: (iss) => !iss.input && "Name is required",
    //         })
    //         .min(3, "Minimum length should be 3"),
    //     dataType: z.enum(DATATYPES, "Invalid datatype"),
    //     isVariant: z.boolean().optional(),
    // }),
});

const baseVendor = z.object({
    vendorType: z.enum(VENDOR_TYPE, "Invalid vendor type"),
    avatar: z
        .url({
            error: (iss) =>
                !iss.input ? "Avatar URL is required" : "Invalid avatar URL",
        })
        .optional(),
    storeName: z
        .string({
            error: (iss) => !iss.input && "Store name is required",
        })
        .min(3, "Minimum length should be 3")
        .max(20, "Maximum length can be 20"),
    fullname: z
        .string({
            error: (iss) => !iss.input && "Fullname is required",
        })
        .min(3, "Minimum length should be 3"),
    phoneNumber: z
        .string({
            error: (iss) => !iss.input && "Phone number is required",
        })
        .regex(REGEX.phoneNumber, "Invalid phone number"),
});

module.exports = {
    addressValidations,
    parentCategoryValidations,
    subCategoryValidations,
    baseVendor,
};
