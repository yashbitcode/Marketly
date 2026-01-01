const { asyncHandler } = require("../utils/asyncHandler");
const productService = require("../services/product.service");
const ApiError = require("../utils/api-error");
const ApiResponse = require("../utils/api-response");

const getAllProducts = asyncHandler(async (req, res) => {
    const allProducts = await productService.getAll({
        "approval.status": "accepted",
    });

    res.json(
        new ApiResponse(200, allProducts, "Products fetched successfully"),
    );
});

const getAllProductsSuperAdmin = asyncHandler(async (req, res) => {
    const allProducts = await productService.getAll();

    res.json(
        new ApiResponse(200, allProducts, "Products fetched successfully"),
    );
});

const getSpecificProduct = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    if (!slug) new ApiError(400, "Slug is required");

    const product = await productService.getProduct({
        slug,
        "approval.status": "accepted",
    });

    if (!product) throw new ApiError(404, "Product not found");

    res.json(new ApiResponse(200, product, "Product fetched successfully"));
});

const getAllVendorProducts = asyncHandler(async (req, res) => {
    const { _id } = req.user.vendorId;

    const allProducts = await productService.getAll({ vendor: _id });

    res.json(
        new ApiResponse(200, allProducts, "Products fetched successfully"),
    );
});

const addVendorProduct = asyncHandler(async (req, res) => {
    const { _id } = req.user.vendorId;
    const payload = req.body;

    const product = await productService.addProduct(_id, payload);

    res.json(new ApiResponse(201, product, "Product added successfully"));
});

const updateVendorProduct = asyncHandler(async (req, res) => {
    const payload = req.body;
    const { slug } = req.params;
    const { _id } = req.user.vendorId;

    const product = await productService.updateProduct(
        { vendor: _id, slug },
        payload,
    );

    if (!product) throw new ApiError(404, "Product not found");

    res.json(new ApiResponse(200, product, "Product "));
});

const updateProductStatus = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { status, remarks, isActive } = req.body;

    const product = await productService.updateProduct(
        { slug },
        { isActive, "approval.status": status, "approval.remarks": remarks },
    );

    if(!product) throw new ApiError(404, "Product not found");

    res.json(new ApiResponse(200, product, "Product updated successfully"));
});

module.exports = {
    getAllProducts,
    getSpecificProduct,
    getAllVendorProducts,
    getAllProductsSuperAdmin,
    addVendorProduct,
    updateVendorProduct,
    updateProductStatus
};
