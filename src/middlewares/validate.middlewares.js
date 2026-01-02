const ApiError = require("../utils/api-error");
const { asyncHandler } = require("../utils/asyncHandler");
const z = require("zod");

const validate = (validationSchema, isQuery = false) => {
    return asyncHandler((req, res, next) => {
        const validation = validationSchema.safeParse((isQuery ? req.query : req.body) || {});

        if (!validation.success)
            throw new ApiError(
                400,
                "Validation error",
                z.flattenError(validation.error),
            );

        if(isQuery) req.query = validation.data;
        else req.body = validation.data;

        next();
    });
};

module.exports = {
    validate,
};
