const { Router } = require("express");
const { addAddress } = require("../controllers/address.controllers");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const router = Router();

router.post("/", isAuthenticated , addAddress);

module.exports = router;
