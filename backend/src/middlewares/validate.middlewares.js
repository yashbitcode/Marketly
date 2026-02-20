import ApiError from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import z from "zod";

const validate = (validationSchema, isQuery = false) => {
    return asyncHandler((req, res, next) => {
        try {
            const validation = validationSchema.safeParse(
                (isQuery ? req.query : req.body) || {},
            );

            if (!validation.success)
                throw new ApiError(
                    400,
                    "Validation error",
                    z.flattenError(validation.error),
                );
            if (!isQuery) req.body = validation.data;

            next();
        } catch (err) {
            console.log(err);
        }
    });
};

export { validate };
