import z from "zod";
import {
    REGEX,
    ADDRESS_TYPE,
    VENDOR_TYPE,
    ATTRIBUTE_DATATYPES,
    ALLOWED_FILETYPES,
} from "./constants.js";

const productRecords = z.record(
        z.string(),
        z.number().min(1, "Minimum 1 quantity is required"),
    );

const baseMediaValidations = z.object({
    fileId: z
        .string({
            error: (iss) => !iss.input && "File ID is required",
        })
        .min(1, "File ID is required"),
    url: z.url({
        error: (iss) => (!iss.input ? "URL is required" : "Invalid URL"),
    }),
    thumbnailUrl: z.url({
        error: (iss) =>
            !iss.input ? "Thumbnail URL is required" : "Invalid thumbnail URL",
    }),
    filename: z
        .string({
            error: (iss) => !iss.input && "Filename is required",
        })
        .min(1, "Filename is required"),
});

const addressValidations = z.object({
    fullname: z
        .string({
            error: (iss) => !iss.input && "Fullname is required",
        })
        .min(1, "Fullname is required")
        .min(3, "Minimum length should be 3")
        .max(8, "Minimum length should be 8"),
    phoneNumber: z
        .string({
            error: (iss) => !iss.input && "Phone number is required",
        })
        .min(1, "Phone number is required")
        .regex(REGEX.phoneNumber, "Invalid phone number"),
    addressLine1: z
        .string({
            error: (iss) => !iss.input && "Address line 1 is required",
        })
        .min(1, "Address line 1 is required"),

    addressLine2: z.string().optional(),
    city: z
        .string({
            error: (iss) => !iss.input && "City is required",
        })
        .min(1, "City is required"),
    state: z
        .string({
            error: (iss) => !iss.input && "State is required",
        })
        .min(1, "State is required"),
    postalCode: z
        .string({
            error: (iss) => !iss.input && "Postal code is required",
        })
        .min(1, "Postal code is required"),
    country: z
        .string({
            error: (iss) => !iss.input && "Country is required",
        })
        .min(1, "Country is required"),
    addressType: z.enum(ADDRESS_TYPE, "Invalid address type").optional(),
});

const parentCategoryValidations = z.object({
    name: z
        .string({
            error: (iss) => !iss.input && "Name is required",
        })
        .min(1, "Name is required")
        .min(3, "Minimum length should be 3"),
});

const subCategoryValidations = z.object({
    name: z
        .string({
            error: (iss) => !iss.input && "Name is required",
        })
        .min(1, "Name is required")
        .min(3, "Minimum length should be 3"),
    parentCategory: z
        .string({
            error: (iss) => !iss.input && "Parent category ID is required",
        })
        .min(1, "Parent category ID is required")
        .refine((val) => REGEX.objectId.test(val), {
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
    avatar: baseMediaValidations.optional(),
    storeName: z
        .string({
            error: (iss) => !iss.input && "Store name is required",
        })
        .min(1, "Store name is required")
        .min(3, "Minimum length should be 3")
        .max(20, "Maximum length can be 20"),
    fullname: z
        .string({
            error: (iss) => !iss.input && "Fullname is required",
        })
        .min(1, "Fullname is required")
        .min(3, "Minimum length should be 3"),
    phoneNumber: z
        .string({
            error: (iss) => !iss.input && "Phone number is required",
        })
        .min(1, "Phone number is required")
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
                !(isVariant === Array.isArray(value)) ||
                !(!isVariant === !Array.isArray(value))
            ) {
                ctx.addIssue({
                    message: "Invalid value with respect to datatype/isVariant",
                    path: ["value"],
                });

                return;
            }

            const types = isVariant ? value : [value];
            const chk = types.every(
                (el) =>
                    typeof el === (dataType === "text" ? "string" : dataType),
            );

            if (!chk)
                ctx.addIssue({
                    message: "Invalid value with respect to datatype/isVariant",
                    path: ["value"],
                });

            if (isVariant && value.length === 0)
                ctx.addIssue({
                    message: "Attribute value shouldn't be empty",
                    path: ["value"],
                });
        }),
);

const baseProductValidations = z.object({
    name: z
        .string({
            error: (iss) => !iss.input && "Product name is required",
        })
        .min(1, "Product name is required")
        .min(3, "Minimum length should be 3"),
    brandName: z
        .string({
            error: (iss) => !iss.input && "Brand name is required",
        })
        .min(1, "Brand name is required")
        .min(3, "Minimum length should be 3"),
    price: z
        .number({
            error: (iss) => !iss.input && "Price is required",
        })
        .refine((price) => price > 0, {
            message: "Invalid price",
        }),
    stockQuantity: z
        .number({
            error: (iss) => !iss.input && "Stock quantity is required",
        })
        .min(0, "Stock quantity can't be negative"),
    category: z
        .string({
            error: (iss) => !iss.input && "Category ID is required",
        })
        .min(1, "Category ID is required")
        .refine((val) => REGEX.objectId.test(val), {
            message: "Invalid category ID",
        }),
    description: z
        .string({
            error: (iss) => !iss.input && "Description is required",
        })
        .min(1, "Description is required")
        .min(20, "Minimum length should be 20"),
    pros: z
        .array(z.string().min(1, "Pro is required"), {
            error: (iss) => !iss.input && "Pros are required",
        })
        .min(1, "Atleast 1 pros should be there"),
    cons: z
        .array(z.string().min(1, "Con is required"), {
            error: (iss) => !iss.input && "Cons are required",
        })
        .min(1, "Atleast 1 cons should be there"),
    keyFeatures: z
        .array(z.string().min(1, "Key feature is required"), {
            error: (iss) => !iss.input && "Key features are required",
        })
        .min(1, "Atleast 1 key feature should be there"),
    images: z
        .array(baseMediaValidations)
        .min(1, "Atleast 1 image should be there"),
});

const clientSideAttributesValidations = z
  .object({
    name: z.string({
      error: (iss) => !iss.input && "Attribute name is required",
    }).min(1, "Product name is required"),

    dataType: z.enum(ATTRIBUTE_DATATYPES, {
      message: "Invalid attribute datatype",
    }),

    isVariant: z.boolean({
      error: (iss) => !iss.input && "Variant flag is required",
    }),

    value: z.string().min(1, "Value is required")
  })
  .superRefine((data, ctx) => {
    const val = data.value || "";

    const arr = val
      .split(",")
      .map(v => v.trim())
      .filter(Boolean);

    if (data.isVariant && arr.length === 0) {
      ctx.addIssue({
        path: ["value"],
        message: "Value cannot be empty",
      });
      return;
    }

    if (data.dataType === "text") {
      if (!arr.every(el => el.length > 0)) {
        ctx.addIssue({
          path: ["value"],
          message: "Invalid text values",
        });
      }
    }

    if (data.dataType === "number") {
      if (!arr.every(el => !isNaN(+el))) {
        ctx.addIssue({
          path: ["value"],
          message: "Invalid number values",
        });
      }
    }
  });

const clientSideFileValidations = (fileLength, required = false) => {
    return z
            .custom((val) => {
                if (typeof window === "undefined") return true;
                if (!val) return true;
    
                return val instanceof FileList;
            }, "Invalid file type")
            .refine((files) => {
                if(!required) return true;
                return files.length > 0
            }, {
                message: "Atleast 1 file is required"
            })
            .refine((files) => files.length <= fileLength, {
                message: `At max ${fileLength} attachments can be there`,
            })
            .refine(
                (files) =>
                    Array.from(files).every((file) =>
                        ALLOWED_FILETYPES.includes(file.type),
                    ),
                {
                    message:
                        "Invalid file type. Only JPG, JPEG, PNG & WEBP are accepted.",
                },
            )
}

export {
    addressValidations,
    parentCategoryValidations,
    subCategoryValidations,
    baseVendor,
    baseProductValidations,
    baseProductAttributeValidations,
    baseMediaValidations,
    productRecords,
    clientSideFileValidations,
    clientSideAttributesValidations
};
