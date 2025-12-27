const ParentCategory = require("../models/parentCategory.model");
const SubCategory = require("../models/subCategory.model");

class CategoryService {
    async getAllParentCategories() {
        const allCategories = await ParentCategory.find({});
        return allCategories;
    }

    async getAllSubCategories() {
        const allCategories = await SubCategory.find({}).populate(
            "parentCategory",
        );
        return allCategories;
    }

    async updateParentCategory(slug, payload) {
        const updatedCategory = await ParentCategory.updateOne(
            { slug },
            payload,
            { new: true },
        );
        return updatedCategory;
    }

    async updateSubCategory(slug, payload) {
        const updatedCategory = await SubCategory.findOneAndUpdate(
            { slug },
            payload,
            { new: true, runValidators: true },
        );
        return updatedCategory;
    }
}

module.exports = new CategoryService();
