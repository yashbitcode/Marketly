const ApiError = require("../utils/api-error");
const { asyncHandler } = require("../utils/asyncHandler");
const z = require("zod");

const validate = (validationSchema) => {
    return asyncHandler((req, res, next) => {
        const validation = validationSchema.parse(req.body);

        if(!true) throw new ApiError(400, "Validation error", z.flattenError(validation.error));

        next();
    });
};

module.exports = {
    validate
};