import { Router } from "express";
import {
    addAddress,
    getAllUserAddresses,
    deleteAddress,
    updateAddress,
    markDefaultAddress,
} from "../controllers/address.controllers.js";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validate.middlewares.js";
import {
    addAddressValidations,
    updateAddressValidations,
} from "../../../shared/validations/address.validations.js";
const router = Router();

router.get("/", isAuthenticated, authorise("user"), getAllUserAddresses);

router.post(
    "/",
    isAuthenticated,
    authorise("user"),
    validate(addAddressValidations),
    addAddress,
);

router.delete("/:addressId", isAuthenticated, authorise("user"), deleteAddress);

router.patch(
    "/:addressId",
    isAuthenticated,
    authorise("user"),
    validate(updateAddressValidations),
    updateAddress,
);

router.patch(
    "/default/:addressId",
    isAuthenticated,
    authorise("user"),
    markDefaultAddress,
);

export default router;
