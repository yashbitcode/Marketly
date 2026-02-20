import mongoose from "mongoose";
import User from "./user.models.js";
import Product from "./product.models.js";

const ReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Product,
        },
        ratings: {
            type: Number,
            min: [1, "Minimum rating should be 1"],
            max: [5, "Maximum rating can be 5"],
            required: [true, "Ratings are required"],
        },
        heading: {
            type: String,
            min: [5, "Minimum length should be 5"],
            required: [true, "Comment is required"],
        },
        comment: {
            type: String,
            min: [5, "Minimum length should be 5"],
            required: [true, "Comment is required"],
        },
    },
    {
        timestamps: true,
    },
);

const Review = mongoose.model("reviews", ReviewSchema);

export default Review;
