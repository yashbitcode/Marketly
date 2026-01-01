const ParentCategory = require("../models/parentCategory.models");
const Product = require("../models/product.models");
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

    async insertParentCategory({ name }) {
        const category = new ParentCategory({ name });
        await category.save();

        return category;
    }

    async insertSubCategory({ name, parentCategory }) {
        const category = new SubCategory({ name, parentCategory });
        await category.save();

        return category;
    }

    async canParentBeDeleted(parentCategoryId) {
        const isExist = await SubCategory.exists({
            parentCategory: parentCategoryId,
        });

        return isExist;
    }

    async deleteParentCategory(parentCategoryId) {
        const parentCategory = await ParentCategory.findByIdAndDelete(
            parentCategoryId,
        );

        return parentCategory;
    }

    async canSubBeDeleted(subCategoryId) {
        const isExist = await Product.exists({
            category: subCategoryId,
        });

        return isExist;
    }

    async deleteSubCategory(subCategoryId) {
        const subCategory = await SubCategory.findByIdAndDelete(subCategoryId);

        return subCategory;
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
