const {Router} = require("express");
const { isAuthenticated, authorise } = require("../middlewares/auth.middlewares");
const { createStripeConnectedAcc } = require("../controllers/vendorStripe.controllers");
const { getOnboardingLink } = require("../services/stripe.service");
const { createConnectedAccountValidations } = require("../validations/vendorStripe.validations");
const { validate } = require("../middlewares/validate.middlewares");
const router = Router();

router.post("/connected-account", isAuthenticated, authorise("vendor"), validate(createConnectedAccountValidations), createStripeConnectedAcc)

router.get("/onboard-link", isAuthenticated, authorise("vendor"), getOnboardingLink);

module.exports = router;