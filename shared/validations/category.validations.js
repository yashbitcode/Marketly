import {
    parentCategoryValidations,
    subCategoryValidations,
} from "../baseValidations.js";

const addParentCategoryValidations = parentCategoryValidations.strict();
const addSubCategoryValidations = subCategoryValidations.strict();
const updateParentCategoryValidations = parentCategoryValidations.partial();
const updateSubCategoryValidations = subCategoryValidations.partial();

export {
    addParentCategoryValidations,
    addSubCategoryValidations,
    updateParentCategoryValidations,
    updateSubCategoryValidations,
};
