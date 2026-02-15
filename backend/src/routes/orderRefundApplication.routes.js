const {Router} = require("express");
const { isAuthenticated, authorise } = require("../middlewares/auth.middlewares");
const { createRefundApplication, getAllRefundApplications } = require("../controllers/orderRefundApplication.controllers");
const { validate } = require("../middlewares/validate.middlewares");
const { createOrderRefundApplicationValidations } = require("../validations/orderRefundApplication.validations");
const router = Router();

router.get("/", isAuthenticated, authorise("super-admin"), getAllRefundApplications);
router.post("/", isAuthenticated, authorise("user"), validate(createOrderRefundApplicationValidations), createRefundApplication);

module.exports = router;