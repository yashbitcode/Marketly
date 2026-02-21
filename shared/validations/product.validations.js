import z from "zod";
import {
    baseProductValidations,
    baseProductAttributeValidations,
} from "../baseValidations.js";
import { PRODUCT_APPROVAL_STATUS } from "../constants.js";

const addProductValidations = baseProductValidations
    .extend({
        attributes: baseProductAttributeValidations
            .min(1, "Atleast 1 attribute should be there")
            .optional(),
    })
    .strict();

const updateProductValidations = baseProductValidations
    .extend({
        attributes: baseProductAttributeValidations.min(
            1,
            "Atleast 1 attribute should be there",
        ),
    })
    .partial();

const updateProductStatusValidations = z
    .object({
        status: z.enum(PRODUCT_APPROVAL_STATUS, {
            message: "Invalid status type",
        }),
        remarks: z
            .string({
                error: (iss) => !iss.input && "Remarks are required",
            })
            .min(10, "Minimum length should be 10"),
        isActive: z.boolean({
            error: (iss) => !iss.input && "Active status is required",
        }),
    })
    .superRefine((data, ctx) => {
        const { status, isActive } = data;

        if (status === "rejected" && isActive)
            ctx.addIssue({
                message: "Invalid active flag with respect to status",
                path: ["isActive"],
            });
        else if (status === "accepted" && !isActive)
            ctx.addIssue({
                message: "Invalid active flag with respect to status",
                path: ["isActive"],
            });
    });

const searchQueryValidations = z.object({
    searchQuery: z.string().optional(),
});

const productQueryValidations = z
    .object({
        minPrice: z.string(),
        maxPrice: z.string(),
        ratings: z.string(),
        brandName: z.string(),
        stockAvailability: z.string(),
    })
    .partial()
    .superRefine((data, ctx) => {
        const { minPrice, maxPrice, ratings, stockAvailability } = data;

        if (minPrice && Number.isNaN(+minPrice))
            ctx.addIssue({
                path: ["minPrice"],
                message: "Min price should be number",
            });

        if (maxPrice && Number.isNaN(+maxPrice))
            ctx.addIssue({
                path: ["maxPrice"],
                message: "Max price should be number",
            });

        if (ratings && Number.isNaN(+ratings))
            ctx.addIssue({
                path: ["ratings"],
                message: "Ratings should be number",
            });

        if (stockAvailability && Number.isNaN(+stockAvailability))
            ctx.addIssue({
                path: ["stockAvailability"],
                message: "Stock availabilityshould can only be 1",
            });
    });

export {
    addProductValidations,
    updateProductValidations,
    updateProductStatusValidations,
    productQueryValidations,
    searchQueryValidations,
};
