const { Router } = require("express");
const {
    addAddress,
    getAllUserAddresses,
    deleteAddress,
    updateAddress,
    markDefaultAddress,
} = require("../controllers/address.controllers");
const { isAuthenticated, authorise } = require("../middlewares/auth.middlewares");
const { validate } = require("../middlewares/validate.middlewares");
const {
    addAddressValidations,
    updateAddressValidations,
} = require("../validations/address.validations");
const router = Router();

router.get("/", isAuthenticated, authorise("user"), getAllUserAddresses);
router.post("/", isAuthenticated, authorise("user"), validate(addAddressValidations), addAddress);
router.delete("/:addressId", isAuthenticated, authorise("user"), deleteAddress);
router.patch(
    "/:addressId",
    isAuthenticated,
    authorise("user"),
    validate(updateAddressValidations),
    updateAddress,
);
router.patch("/default/:addressId", isAuthenticated, authorise("user"), markDefaultAddress);

module.exports = router;
