const mongoose = require("mongoose");
const User = require("./user.models");
const Product = require("./product.models");

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product
    },
    ratings: {
        type: Number,
        min: [1, "Minimum rating should be 1"],
        max: [5, "Maximum rating can be 5"],
        required: [true, "Ratings are required"]
    },
    comment: {
        type: String,
        min: [5, "Minimum length should be 5"],
        required: [true, "Comment is required"]   
    }
}, {
    timestamps: true
});

const Review = mongoose.model("reviews", ReviewSchema);

module.exports = Review;