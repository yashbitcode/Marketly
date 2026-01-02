const { Router } = require("express");
const {
    isAuthenticated,
    authorise,
} = require("../middlewares/auth.middlewares");
const {
    getAllProductReviews,
    addProductReview,
} = require("../controllers/review.controllers");
const { validate } = require("../middlewares/validate.middlewares");
const {
    addProductReviewValidations,
} = require("../validations/review.validations");
const router = Router();

router.get(
    "/product/:slug/:page",
    isAuthenticated,
    authorise("user"),
    getAllProductReviews,
);

router.post(
    "/product",
    isAuthenticated,
    authorise("user"),
    validate(addProductReviewValidations),
    addProductReview,
);

module.exports = router;
