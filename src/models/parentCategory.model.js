const mongoose = require("mongoose");

const ParentCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Parent catgory name is required"],
            min: [3, "Minimum length should be 3"],
            unique: [true, "Parent category already exists"],
        },
    },
    {
        timestamps: true,
    },
);

const ParentCategory = mongoose.model(ParentCategorySchema);

module.exports = ParentCategory;