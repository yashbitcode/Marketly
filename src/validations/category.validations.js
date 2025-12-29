const z = require("zod");
const { isValidObjectId } = require("mongoose");
const { DATATYPES } = require("../utils/constants");

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

const addParentCategoryValidations = parentCategoryValidations.strict();
const addSubCategoryValidations = subCategoryValidations.strict();
const updateParentCategoryValidations = parentCategoryValidations.partial();
const updateSubCategoryValidations = subCategoryValidations.partial();

module.exports = {
    addParentCategoryValidations,
    addSubCategoryValidations,
    updateParentCategoryValidations,
    updateSubCategoryValidations
};
