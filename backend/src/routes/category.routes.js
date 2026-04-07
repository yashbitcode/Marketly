import { Router } from "express";
import {
    getAllParentCategories,
    updateParentCategory,
    getAllSubCategories,
    updateSubCategory,
    addParentCategory,
    addSubCategory,
    deleteParentCategory,
    deleteSubCategory,
    getAllCategories,
} from "../controllers/category.controllers.js";
import { validate } from "../middlewares/validate.middlewares.js";
import {
    addParentCategoryValidations,
    addSubCategoryValidations,
    updateParentCategoryValidations,
    updateSubCategoryValidations,
} from "shared/validations/category.validations.js";
import { authorise, isAuthenticated } from "../middlewares/auth.middlewares.js";
const router = Router();

router.get(
    "/",
    isAuthenticated,
    authorise("super-admin"),
    getAllParentCategories,
);

router.get("/all", getAllCategories);

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

router.delete(
    "/sub/:subCategoryId",
    isAuthenticated,
    authorise("super-admin"),
    deleteSubCategory,
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

export default router;
