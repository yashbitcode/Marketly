const { Router } = require("express");
const {
    getAllParentCategories,
    updateParentCategory,
    getAllSubCategories,
    updateSubCategory,
    addParentCategory,
    addSubCategory,
} = require("../controllers/category.controllers");
const {validate} = require("../middlewares/validate.middlewares");
const {
    addParentCategoryValidations,
    addSubCategoryValidations,
    updateParentCategoryValidations,
    updateSubCategoryValidations,
} = require("../validations/category.validations");
const router = Router();

// super-admin auth

router.get("/", getAllParentCategories);
router.post("/", validate(addParentCategoryValidations), addParentCategory);
router.patch(
    "/:slug",
    validate(updateParentCategoryValidations),
    updateParentCategory,
);

router.get("/sub", getAllSubCategories);
router.post("/sub", validate(addSubCategoryValidations), addSubCategory);
router.patch(
    "/sub/:slug",
    validate(updateSubCategoryValidations),
    updateSubCategory,
);

module.exports = router;
