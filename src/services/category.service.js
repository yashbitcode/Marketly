const ParentCategory = require("../models/parentCategory.models");
const SubCategory = require("../models/subCategory.models");

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

    async insertParentCategory({name}) {
        const category = new ParentCategory({name});
        await category.save()

        return category;
    }

    async insertSubCategory({name, parentCategory}) {
        const category = new SubCategory({name, parentCategory});
        await category.save()

        return category;
    }

    async updateParentCategory(slug, payload) {
        const updatedCategory = await ParentCategory.findOneAndUpdate(
            { slug },
            payload,
            { new: true, runValidators: true },
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
