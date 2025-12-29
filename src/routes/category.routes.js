const { Router } = require("express");
const {
    getAllParentCategories,
    updateParentCategory,
    getAllSubCategories,
    updateSubCategory,
    addParentCategory,
    addSubCategory,
    deleteParentCategory,
} = require("../controllers/category.controllers");
const { validate } = require("../middlewares/validate.middlewares");
const {
    addParentCategoryValidations,
    addSubCategoryValidations,
    updateParentCategoryValidations,
    updateSubCategoryValidations,
} = require("../validations/category.validations");
const {
    authorise,
    isAuthenticated,
} = require("../middlewares/auth.middlewares");
const router = Router();

router.get(
    "/",
    isAuthenticated,
    authorise("super-admin"),
    getAllParentCategories,
);
router.post(
    "/",
    isAuthenticated,
    authorise("super-admin"),
    validate(addParentCategoryValidations),
    addParentCategory,
);

router.delete(
    "/:parentCategoryId",
    isAuthenticated,
    authorise("super-admin"),
    deleteParentCategory,
);

router.patch(
    "/:slug",
    isAuthenticated,
    authorise("super-admin"),
    validate(updateParentCategoryValidations),
    updateParentCategory,
);

router.get(
    "/sub",
    isAuthenticated,
    authorise("super-admin"),
    getAllSubCategories,
);
router.post(
    "/sub",
    isAuthenticated,
    authorise("super-admin"),
    validate(addSubCategoryValidations),
    addSubCategory,
);
router.patch(
    "/sub/:slug",
    isAuthenticated,
    authorise("super-admin"),
    validate(updateSubCategoryValidations),
    updateSubCategory,
);

module.exports = router;
