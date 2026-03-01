import { Router } from "express";
import {
    getAllProducts,
    getSpecificProduct,
    addVendorProduct,
    updateVendorProduct,
    updateProductStatus,
    getFilteredProducts,
} from "../controllers/product.controllers.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { authorise, isAuthenticated } from "../middlewares/auth.middlewares.js";
import {
    addProductValidations,
    updateProductValidations,
    updateProductStatusValidations,
    productQueryValidations,
    searchQueryValidations,
} from "../../../shared/validations/product.validations.js";
const router = Router();

router.get(
    "/filter/:page",
    validate(productQueryValidations, true),
    getFilteredProducts,
);

router.get("/:page", getAllProducts);

// router.get("/search/:searchQuery/:page", searchProduct);

// router.get(
//     "/super-admin/:page",
//     isAuthenticated,
//     authorise("super-admin"),
//     getAllProductsSuperAdmin,
// );

router.post(
    "/vendor",
    isAuthenticated,
    authorise("vendor"),
    validate(addProductValidations),
    addVendorProduct,
);

router.patch(
    "/vendor/:slug",
    isAuthenticated,
    authorise("vendor"),
    validate(updateProductValidations),
    updateVendorProduct,
);

router.patch(
    "/approval/:slug",
    isAuthenticated,
    authorise("super-admin"),
    validate(updateProductStatusValidations),
    updateProductStatus,
);

router.get("/slug/:slug", getSpecificProduct);

export default router;
