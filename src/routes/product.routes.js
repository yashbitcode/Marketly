const { Router } = require("express");
const {
    getAllProducts,
    getSpecificProduct,
    getAllProductsSuperAdmin,
    addVendorProduct,
    updateVendorProduct,
    updateProductStatus
} = require("../controllers/product.controllers");
const { validate } = require("../middlewares/validate.middlewares");
const {
    authorise,
    isAuthenticated,
} = require("../middlewares/auth.middlewares");
const { addProductValidations, updateProductValidations, updateProductStatusValidations } = require("../validations/product.validations");
const router = Router();

router.get("/", getAllProducts);
router.get(
    "/super-admin",
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
router.patch("/approval/:slug", isAuthenticated, authorise("super-admin"), validate(updateProductStatusValidations), updateProductStatus)
router.get("/:slug", getSpecificProduct);

module.exports = router;
