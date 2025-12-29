const { getMe } = require("../controllers/me.controllers");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const { Router } = require("express");
const router = Router();

router.get("/", isAuthenticated, getMe);

module.exports = router;