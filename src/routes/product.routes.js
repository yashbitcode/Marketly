const { Router } = require("express");
const {
    getAllProducts,
    getSpecificProduct,
    getAllProductsSuperAdmin,
    addVendorProduct,
    updateVendorProduct,
    updateProductStatus,
    searchProduct,
    getFilteredProducts,
} = require("../controllers/product.controllers");
const { validate } = require("../middlewares/validate.middlewares");
const {
    authorise,
    isAuthenticated,
} = require("../middlewares/auth.middlewares");
const {
    addProductValidations,
    updateProductValidations,
    updateProductStatusValidations,
} = require("../validations/product.validations");
const router = Router();

router.get('/filter/:page', getFilteredProducts)

router.get("/:page", getAllProducts);

router.get("/search/:searchQuery/:page", searchProduct);

router.get(
    "/super-admin/:page",
    isAuthenticated,
    authorise("super-admin"),
    getAllProductsSuperAdmin,
);

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

router.get("/:slug", getSpecificProduct);

module.exports = router;
