const { parentCategoryValidations, subCategoryValidations } = require("../utils/baseValidations");

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
