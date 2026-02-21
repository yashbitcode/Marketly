import Review from "../models/review.models.js";
import { GENERAL_USER_FIELDS } from "../../../shared/constants.js";
import { getPaginationBasePipeline } from "../utils/helpers.js";

class ReviewService {
    async getAllProductReviewsBySlug(slug, page = 1) {
        const basePagination = getPaginationBasePipeline(+page);

        const [allReviews] = await Review.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: GENERAL_USER_FIELDS,
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $addFields: {
                    product: { $arrayElemAt: ["$product", 0] },
                    user: { $arrayElemAt: ["$user", 0] },
                },
            },
            {
                $match: {
                    "product.slug": slug,
                },
            },
            ...basePagination,
        ]);

        return allReviews;
    }

    async addProductReview(payload) {
        const { user, product, ratings, heading, comment } = payload;

        const review = new Review({ user, product, ratings, heading, comment });

        review.save();

        return review;
    }
}

export default new ReviewService();
