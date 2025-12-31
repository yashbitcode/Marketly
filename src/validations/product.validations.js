const { baseProductValidations, baseProductAttributeValidations } = require("../utils/baseValidations");

const addProductValidations = baseProductValidations
    .extend({
        attributes: baseProductAttributeValidations.optional(),
    })
    .strict();

module.exports = {
    addProductValidations
};