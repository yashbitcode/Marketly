const {Router} = require("express");
const { test } = require("../controllers/inngest.controllers");
const router = Router();

router.get("/hello", test)

module.exports = router;