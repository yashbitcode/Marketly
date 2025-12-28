const mongoose = require("mongoose");
const ParentCategory = require("./parentCategory.models");
const { generateSlug } = require("../utils/helpers");

const SubCategorySchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: [true, "Slug should be unique"]
        },
        name: {
            type: String,
            required: [true, "Sub catgory name is required"],
            min: [3, "Minimum length should be 3"],
            unique: [true, "Sub category already exists"],
            trim: true
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: ParentCategory,
            required: [true, "Parent category ID is required"],
        },
        // attributes: {
        //     name: {
        //         type: String,
        //         required: [true, "Attribute name is required"]
        //     },
        //     dataType: {
        //         type: String,
        //         required: [true, "Data type is required"],
        //         enum: {
        //             values: DATATYPES,
        //             message: "`VALUE` is not a valid value"
        //         }
        //     },
        //     isVariant: {
        //         type: Boolean,
        //         default: false
        //     }
        // }
    },
    {
        timestamps: true,
    },
);

SubCategorySchema.pre("validate", function() {
    if(this.isModified("name")) this.slug = generateSlug(this.name);
});

SubCategorySchema.pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();

    if(!update.name) next();

    update.slug = generateSlug(update.name);

    this.setUpdate(update);
});

const SubCategory = mongoose.model("sub-categories", SubCategorySchema);

module.exports = SubCategory;