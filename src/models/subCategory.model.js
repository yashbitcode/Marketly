const mongoose = require("mongoose");
const ParentCategory = require("./parentCategory.model");
const { DATATYPES } = require("../utils/constants");

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
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: ParentCategory
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

const SubCategory = mongoose.model(SubCategorySchema);

module.exports = SubCategory;