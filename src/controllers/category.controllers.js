const { asyncHandler } = require("../utils/asyncHandler");
const categoryService = require("../services/category.service");
const ApiResponse = require("../utils/api-response");
const ApiError = require("../utils/api-error");

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

const addParentCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.insertParentCategory(req.body);

    res.json(
        new ApiResponse(
            200,
            category,
            "Parent category added successfully",
        ),
    );
});

const addSubCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.insertSubCategory(req.body);

    res.json(
        new ApiResponse(
            200,
            category,
            "Sub category added successfully",
        ),
    );
});

const deleteParentCategory = asyncHandler(async (req, res) => {
    const {parentCategoryId} = req.params;
    const isExist = await categoryService.canParentBeDeleted(parentCategoryId);

    if(isExist) throw new ApiError(403, "Sub category is attached to this parent category");
    
    const parentCategory = await categoryService.deleteParentCategory(parentCategoryId);

    if(!parentCategory) throw new ApiError(404, "Parent category not found");

    res.json(new ApiResponse(200, parentCategory, "Parent category deleted successfully"));
});

const deleteSubCategory = asyncHandler(async (req, res) => {
    const {subCategoryId} = req.params;
    const isExist = await categoryService.canSubBeDeleted(subCategoryId);

    if(isExist) throw new ApiError(403, "Product is attached to this category");
    
    const subCategory = await categoryService.deleteSubCategory(subCategoryId);

    if(!subCategory) throw new ApiError(404, "Category not found");

    res.json(new ApiResponse(200, subCategory, "Category deleted successfully"));
});

const updateParentCategory = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const updatedCategory = await categoryService.updateParentCategory(
        slug,
        req.body,
    );

    if(!updatedCategory) throw new ApiError(404, "Slug not found");

    res.json(
        new ApiResponse(
            200,
            updatedCategory,
            "Parent category updated successfully",
        ),
    );
});

const updateSubCategory = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const updatedCategory = await categoryService.updateSubCategory(
        slug,
        req.body,
    );

    if(!updatedCategory) throw new ApiError(404, "Slug not found");

    res.json(
        new ApiResponse(
            200,
            updatedCategory,
            "Sub category updated successfully",
        ),
    );
});

module.exports = {
    getAllParentCategories,
    getAllSubCategories,
    addParentCategory,
    addSubCategory,
    deleteParentCategory,
    deleteSubCategory,
    updateParentCategory,
    updateSubCategory,
};
