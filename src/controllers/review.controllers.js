const reviewService = require("../services/review.service");
const ApiResponse = require("../utils/api-response");
const { asyncHandler } = require("../utils/asyncHandler");

const getAllProductReviews = asyncHandler(async (req, res) => {
    const { slug, page } = req.params;

    const allReviews = await reviewService.getAllProductReviewsBySlug(slug, +page);

    res.json(
        new ApiResponse(200, allReviews, "All reviews fetched successfully"),
    );
});

const addProductReview = asyncHandler(async (req, res) => {
    const payload = req.body;
    
    const review = await reviewService.addProductReview(payload); 

    res.json(new ApiResponse(201, review, "Review added successfully"));
});

module.exports = {
    getAllProductReviews,
    addProductReview
}