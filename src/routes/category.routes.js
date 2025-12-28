const {Router} = require("express");
const { getAllParentCategories, updateParentCategory, getAllSubCategories, updateSubCategory, addParentCategory, addSubCategory } = require("../controllers/category.controllers");
const router = Router();

router.get("/", getAllParentCategories);
router.post("/", addParentCategory);
router.patch("/:slug", updateParentCategory);

router.get("/sub", getAllSubCategories);
router.post("/sub", addSubCategory);
router.patch("/sub/:slug", updateSubCategory);

module.exports = router;