const z = require("zod");
const {
    REGEX,
    ADDRESS_TYPE,
    VENDOR_TYPE,
    ATTRIBUTE_DATATYPES,
} = require("./constants");
const { isValidObjectId } = require("mongoose");

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

const baseProductAttributeValidations = z.array(
    z
        .object({
            name: z.string({
                error: (iss) => !iss.input && "Attribute name is required",
            }),
            dataType: z.enum(ATTRIBUTE_DATATYPES, "Invalid attribute datatype"),
            isVariant: z.boolean({
                error: (iss) => !iss.input && "Variant flag is required",
            }),
            value: z.union([
                z.string(),
                z.number(),
                z.array(z.string()),
                z.array(z.number()),
            ]),
        })
        .superRefine((data, ctx) => {
            const { dataType, isVariant, value } = data;

            if (
                !(
                    (isVariant && Array.isArray(value)) ||
                    !(!isVariant && !Array.isArray(value))
                )
            )
                return ctx.addIssue({
                    message: "Invalid value with respect to datatype/isVariant",
                    path: ["value"],
                });

            const types = isVariant ? value : [value];
            const chk = types.every((el) => typeof el === dataType);

            if (!chk)
                return ctx.addIssue({
                    message: "Invalid value with respect to datatype/isVariant",
                    path: ["value"],
                });
        }),
);

const baseProductValidations = z.object({
    name: z
        .string({
            error: (iss) => !iss.input && "Product name is required",
        })
        .min(3, "Minimum length should be 3"),
    brandName: z
        .string({
            error: (iss) => !iss.input && "Brand name is required",
        })
        .min(3, "Minimum length should be 3"),
    price: z
        .number({
            error: (iss) => !iss.input && "Price is required",
        })
        .refine((price) => price > 0, {
            message: "Invalid price",
        }),
    stockQuantity: z.number({
        error: (iss) => !iss.input && "Stock quantity is required",
    }).min[(0, "Stock quantity can't be negative")],
    category: z
        .string({
            error: (iss) => !iss.input && "Category ID is required",
        })
        .refine((val) => isValidObjectId(val), {
            message: "Invalid category ID",
        }),
    vendor: z
        .string({
            error: (iss) => !iss.input && "Vendor ID is required",
        })
        .refine((val) => isValidObjectId(val), {
            message: "Invalid vendor ID",
        }),
    description: z
        .string({
            error: (iss) => !iss.input && "Description is required",
        })
        .min(20, "Minimum length should be 20"),
    pros: z
        .array(z.string(), {
            error: (iss) => !iss.input && "Pros are required",
        })
        .min(1, "Atleast 1 pros should be there"),
    cons: z
        .array(z.string(), {
            error: (iss) => !iss.input && "Cons are required",
        })
        .min(1, "Atleast 1 cons should be there"),
    keyFeatures: z
        .array(z.string(), {
            error: (iss) => !iss.input && "Key features are required",
        })
        .min(1, "Atleast 1 key feature should be there"),
    images: z
        .array(z.string(), {
            error: (iss) => !iss.input && "Images are required",
        })
        .min(1, "Atleast 1 image should be there"),
});

module.exports = {
    addressValidations,
    parentCategoryValidations,
    subCategoryValidations,
    baseVendor,
    baseProductValidations,
    baseProductAttributeValidations,
};
