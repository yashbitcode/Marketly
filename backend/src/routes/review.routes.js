import { Router } from "express";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
import {
    getAllProductReviews,
    addProductReview,
} from "../controllers/review.controllers.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { addProductReviewValidations } from "../../../shared/validations/review.validations.js";
const router = Router();

router.get(
    "/product/:slug/:page",
    // isAuthenticated,
    // authorise("user"),
    getAllProductReviews,
);

router.post(
    "/product",
    isAuthenticated,
    authorise("user"),
    validate(addProductReviewValidations),
    addProductReview,
);

export default router;
