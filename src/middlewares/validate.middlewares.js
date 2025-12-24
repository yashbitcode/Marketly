const ApiError = require("../utils/api-error");
const { asyncHandler } = require("../utils/asyncHandler");
const z = require("zod");

const validate = (validationSchema) => {
    return asyncHandler((req, res, next) => {
        const validation = validationSchema.safeParse(req.body || {});

        if(!validation.success) throw new ApiError(400, "Validation error", z.flattenError(validation.error).fieldErrors);

        req.body = validation.data;
        next();
    });
};

module.exports = {
    validate
};