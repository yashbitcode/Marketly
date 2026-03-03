import z from "zod";

export const getImageKitTokensValidations = z.object({
    totalCounts: z
        .number()
        .min(1, "Minimum can be 1")
        .max(4, "Maximum can be 4"),
});
