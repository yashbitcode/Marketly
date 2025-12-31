const {
    baseProductValidations,
    baseProductAttributeValidations,
} = require("../utils/baseValidations");

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

module.exports = {
    addProductValidations,
    updateProductValidations,
};
