const { Router } = require("express");
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
const { getAllProductReviews, addProductReview } = require("../controllers/review.controllers");
const { validate } = require("../middlewares/validate.middlewares");
const { addProductReviewValidations } = require("../validations/review.validations");
const router = Router();

router.get("/product/:slug", isAuthenticated, getAllProductReviews);
router.post("/product", isAuthenticated, validate(addProductReviewValidations), addProductReview);

module.exports = router;
