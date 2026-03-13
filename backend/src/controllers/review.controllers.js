import productService from "../services/product.service.js";
import reviewService from "../services/review.service.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllProductReviews = asyncHandler(async (req, res) => {
    const { slug, page } = req.params;

    const allReviews = await reviewService.getAllProductReviewsBySlug(
        slug,
        +page,
    );

    res.json(
        new ApiResponse(200, allReviews, "All reviews fetched successfully"),
    );
});

const addProductReview = asyncHandler(async (req, res) => {
    const {slug, ratings, heading, comment} = req.body;

    const product = await productService.getProductBySlug(slug);

    if(!product) throw new ApiError(404, "Product not found");

    const review = await reviewService.addProductReview({user: req.user._id, product: product._id, ratings, heading, comment});

    res.json(new ApiResponse(201, review, "Review added successfully"));
});

export {
    getAllProductReviews,
    addProductReview,
};
