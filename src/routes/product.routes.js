const { Router } = require("express");
const {
    getAllProducts,
    getSpecificProduct,
    getAllProductsSuperAdmin,
} = require("../controllers/product.controllers");
const {
    authorise,
    isAuthenticated,
} = require("../middlewares/auth.middlewares");
const router = Router();

router.get("/", getAllProducts);
router.get(
    "/super-admin",
    isAuthenticated,
    authorise("super-admin"),
    getAllProductsSuperAdmin,
);
router.get("/:slug", getSpecificProduct);

module.exports = router;
