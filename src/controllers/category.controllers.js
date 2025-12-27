const { asyncHandler } = require("../utils/asyncHandler");
const ParentCategory = require("../models/parentCategory.model");
const categoryService = require("../services/category.service");

const getAllParentCategories = asyncHandler(async (req, res) => {
    const allCategories = await categoryService.getAllParentCategories();

    res.json(
        new ApiResponse(
            200,
            allCategories,
            "Parent categories fetched successfully",
        ),
    );
});

const getAllSubCategories = asyncHandler(async (req, res) => {
    const allCategories = await categoryService.getAllSubCategories();

    res.json(
        new ApiResponse(
            200,
            allCategories,
            "Sub categories fetched successfully",
        ),
    );
});

const updateParentCategory = asyncHandler(async (req, res) => {
    const {slug} = req.params;
    const updatedCategory = await categoryService.updateParentCategory(slug, req.body);

    res.json(new ApiResponse(200, updatedCategory, "Parent category updated successfully"));
});

const updateSubCategory = asyncHandler(async (req, res) => {
    const {slug} = req.params;
    const updatedCategory = await categoryService.updateSubCategory(slug, req.body);

    res.json(new ApiResponse(200, updatedCategory, "Sub category updated successfully"));
});


module.exports = {
    getAllParentCategories,
    getAllSubCategories,
    updateParentCategory,
    updateSubCategory
};
