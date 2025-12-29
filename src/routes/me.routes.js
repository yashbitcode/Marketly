const { getMe } = require("../controllers/me.controllers");
const { isAuthenticated, authorise } = require("../middlewares/auth.middlewares");
const { Router } = require("express");
const router = Router();

router.get("/", isAuthenticated, authorise("user", "vendor", "super-admin"), getMe);

module.exports = router;