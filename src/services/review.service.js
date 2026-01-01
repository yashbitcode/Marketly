const Review = require("../models/review.models");
const { GENERAL_USER_FIELDS } = require("../utils/constants");

class ReviewService {
    async getAllProductReviewsBySlug(slug) {
        const allReviews = await Review.find({}).populate([
            {
                path: "user",
                select: GENERAL_USER_FIELDS,
            },
            {
                path: "product",
                match: {
                    slug
                },
                populate: [
                    {
                        path: "category",
                    },
                    {
                        path: "vendor",
                    },
                ],
            },
        ]);

        return allReviews;
    }

    async addProductReview(payload) {
        const { user, product, ratings, comment } = payload;

        const review = new Review({ user, product, ratings, comment });

        review.save();

        return review;
    }
}

module.exports = new ReviewService();
