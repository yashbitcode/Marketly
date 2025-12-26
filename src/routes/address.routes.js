const { Router } = require("express");
const {
    addAddress,
    getAllUserAddresses,
    deleteAddress,
    updateAddress,
} = require("../controllers/address.controllers");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const { validate } = require("../middlewares/validate.middlewares");
const {
    addAddressValidations,
    updateAddressValidations,
} = require("../validations/address.validations");
const router = Router();

router.get("/", isAuthenticated, getAllUserAddresses);
router.post("/", isAuthenticated, validate(addAddressValidations), addAddress);
router.delete("/:addressId", isAuthenticated, deleteAddress);
router.patch(
    "/:addressId",
    isAuthenticated,
    validate(updateAddressValidations),
    updateAddress,
);

module.exports = router;
