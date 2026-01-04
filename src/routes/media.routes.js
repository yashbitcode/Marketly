const { Router } = require("express");
const router = Router();
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
// const multer = require("../utils/multerUpload");
const {
    getAuthParams,
    deleteFiles,
    getFiles,
} = require("../controllers/media.controllers");

router.post("/", isAuthenticated, authorise("user", "vendor"), getAuthParams);
router.delete("/files", isAuthenticated, authorise("user", "vendor"), deleteFiles);
router.post("/files", isAuthenticated, authorise("user", "vendor"), getFiles);

module.exports = router;
