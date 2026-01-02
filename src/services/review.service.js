const Review = require("../models/review.models");
const { GENERAL_USER_FIELDS, PAGINATION_LIMIT } = require("../utils/constants");

class ReviewService {
    async getAllProductReviewsBySlug(slug, page) {
        const allReviews = await Review.find({})
            .populate([
                {
                    path: "user",
                    select: GENERAL_USER_FIELDS,
                },
                {
                    path: "product",
                    match: {
                        slug,
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
            ])
            .skip(PAGINATION_LIMIT * (page - 1))
            .limit(PAGINATION_LIMIT)
            .sort({
                createdAt: -1
            });

        return allReviews;
    }

    async addProductReview(payload) {
        const { user, product, ratings, heading, comment } = payload;

        const review = new Review({ user, product, ratings, heading, comment });

        review.save();

        return review;
    }
}

module.exports = new ReviewService();
