import { asyncHandler } from "../utils/asyncHandler.js";
import productService from "../services/product.service.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { pubClient as redisClient } from "../config/redis/connection.js";
import { createHash } from "../utils/helpers.js";

const getAllProducts = asyncHandler(async (req, res) => {
    const { page } = req.params;
    let matchStage = {};

    let redisKey = "";

    if (!req?.user?.currentRole || req.user.currentRole === "user") {
        matchStage = {
            "approval.status": "accepted",
            isActive: true,
        };

        redisKey += "user:products:";
    } else if (req.user.currentRole === "vendor") {
        matchStage.vendor = req.user.vendorId._id;

        redisKey += "vendor:products:";
    } else redisKey += "admin:products:";

    redisKey += page ? page : "1";

    let allProducts = await redisClient.get(redisKey);

    if (allProducts)
        return res.json(
            new ApiResponse(200, allProducts, "Products fetched successfully"),
        );

    allProducts = await productService.getAll(matchStage, page);

    await redisClient.set(redisKey, JSON.stringify(allProducts));
    await redisClient.expire(redisKey, 60 * 5);

    res.json(
        new ApiResponse(200, allProducts, "Products fetched successfully"),
    );
});

// const getAllProductsSuperAdmin = asyncHandler(async (req, res) => {
//     const { page } = req.params;

//     const allProducts = await productService.getAll({}, +page);

//     res.json(
//         new ApiResponse(200, allProducts, "Products fetched successfully"),
//     );
// });

// const getAllVendorProducts = asyncHandler(async (req, res) => {
//     const { _id } = req.user.vendorId;

//     const allProducts = await productService.getAll({ vendor: _id });

//     res.json(
//         new ApiResponse(200, allProducts, "Products fetched successfully"),
//     );
// });

const getSpecificProduct = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    if (!slug) new ApiError(400, "Slug is required");

    // let product = await redisClient.get(`product:${slug}`);

    // if (product)
    //     return res.json(
    //         new ApiResponse(
    //             200,
    //             JSON.parse(product),
    //             "Product fetched successfully",
    //         ),
    //     );

    const product = await productService.getProduct({
        slug,
        "approval.status": "accepted",
        isActive: true,
    });

    if (!product) throw new ApiError(404, "Product not found");

    await redisClient.set(`product:${slug}`, JSON.stringify(product));
    await redisClient.expire(`product:${slug}`, 60 * 5);

    res.json(new ApiResponse(200, product, "Product fetched successfully"));
});

const addVendorProduct = asyncHandler(async (req, res) => {
    const { _id, stripeAccountOnboarded } = req.user.vendorId;

    if (!stripeAccountOnboarded)
        throw new ApiError(403, "Get yourself onboarded first");

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

    await redisClient.del(`product:${slug}`);

    res.json(new ApiResponse(200, product, "Product "));
});

const updateProductStatus = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { status, remarks, isActive } = req.body;

    const product = await productService.updateProduct(
        { slug },
        { isActive, "approval.status": status, "approval.remarks": remarks },
    );

    if (!product) throw new ApiError(404, "Product not found");

    res.json(new ApiResponse(200, product, "Product updated successfully"));
});

const getFilteredProducts = asyncHandler(async (req, res) => {
    const { page } = req.params;
    const filterQueries = req.query;
    const { searchQuery } = filterQueries;

    console.log(filterQueries);

    const filteredProducts = await productService.getFilteredProducts(
        { "approval.status": "accepted", isActive: true },
        filterQueries,
        searchQuery,
        +page,
    );

    // let redisKey = "product:";

    // if (searchQuery) redisKey += searchQuery + ":";
    // if (filterQueries?.length > 0) {
    //     const filterQueriesHash = createHash(
    //         JSON.stringify(filterQueries),
    //         process.env.REDIS_KEY_HASH,
    //     );
    //     redisKey += filterQueriesHash.slice(0, 8) + ":";
    // }

    // redisKey += page ? page : "1";

    // console.log(redisKey);

    // await redisClient.set(redisKey, JSON.stringify(filteredProducts));
    // await redisClient.expire(redisKey, 60 * 5);

    res.json(
        new ApiResponse(200, filteredProducts, "Products fetched successfully"),
    );
});

// const getFilteredProducts = asyncHandler(async (req, res) => {
//     const filterQueries = req.query;
//     const { page } = req.params;

//     const filteredProducts = await productService.getFilteredProducts(
//         filterQueries,
//         +page,
//     );

//     res.json(new ApiResponse(200, filteredProducts, "Products fetched successfully"));
// });

export {
    getAllProducts,
    getSpecificProduct,
    // getAllVendorProducts,
    // getAllProductsSuperAdmin,
    addVendorProduct,
    updateVendorProduct,
    updateProductStatus,
    getFilteredProducts,
};
