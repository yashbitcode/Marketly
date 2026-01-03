const {Router} = require("express");
const router = Router();
const multer = require("../utils/multerUpload");
const { getAuthParams } = require("../controllers/upload.controllers");

router.post('/', getAuthParams);

module.exports = router;