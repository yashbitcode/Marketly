const { Router } = require("express");
const {
    getAllProducts,
    getSpecificProduct,
    getAllProductsSuperAdmin,
    addVendorProduct,
} = require("../controllers/product.controllers");
const { validate } = require("../middlewares/validate.middlewares");
const {
    authorise,
    isAuthenticated,
} = require("../middlewares/auth.middlewares");
const { addProductValidations } = require("../validations/product.validations");
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
router.get("/:slug", getSpecificProduct);

module.exports = router;
