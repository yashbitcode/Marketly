const mongoose = require("mongoose");
const { generateSlug } = require("../utils/helpers");

const ParentCategorySchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: [true, "Slug should be unique"],
        },
        name: {
            type: String,
            required: [true, "Parent catgory name is required"],
            min: [3, "Minimum length should be 3"],
            unique: [true, "Parent category already exists"],
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

ParentCategorySchema.pre("validate", function () {
    if (this.isModified("name")) this.slug = generateSlug(this.name);
});

ParentCategorySchema.pre("findOneAndUpdate", function () {
    const update = this.getUpdate();

    if (!update.name) return;

    update.slug = generateSlug(update.name);

    this.setUpdate(update);
});

const ParentCategory = mongoose.model(
    "parent-categories",
    ParentCategorySchema,
);

module.exports = ParentCategory;
