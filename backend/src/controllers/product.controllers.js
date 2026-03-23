import { asyncHandler } from "../utils/asyncHandler.js";
import productService from "../services/product.service.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { pubClient as redisClient } from "../config/redis/connection.js";
import mongoose from "mongoose";

const getAllProducts = asyncHandler(async (req, res) => {
    const { page } = req.params;
    let matchStage = {};

    let redisKey = "";

    // console.log("USER: ", req.user)

    // if (!req?.user?.currentRole || req.user.currentRole === "user") {
    //     matchStage = {
    //         "approval.status": "accepted",
    //         isActive: true,
    //     };

    //     redisKey += "user:products:";
    // }

    if (req.user.currentRole === "vendor") {
        matchStage.vendor = new mongoose.Types.ObjectId(req.user.vendorId._id);

        redisKey += "vendor:products:";
    } else redisKey += "admin:products:";

    // redisKey += page ? page : "1";
    // let allProducts = await redisClient.get(redisKey);
    let allProducts;

    // if (allProducts)
    //     return res.json(
    //         new ApiResponse(
    //             200,
    //             JSON.parse(allProducts),
    //             "Products fetched successfully",
    //         ),
    //     );

    allProducts = await productService.getAll(matchStage, page);

    // await redisClient.set(redisKey, JSON.stringify(allProducts));
    // await redisClient.expire(redisKey, 60 * 5);

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

/* a */

const getSpecificProduct = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    if (!slug) new ApiError(400, "Slug is required");

    let key;
    const matchStage = {slug};

    // console.log("USER->>>: ", req.user)
    if (req.user) {
        if (req.user.currentRole === "vendor") {
            key = `vendor:product:${slug}`;
            matchStage.vendor = new mongoose.Types.ObjectId(req.user.vendorId._id);
        }
        else key = `admin:product:${slug}`;
    } else {
        key = `product:${slug}`;
        matchStage["approval.status"] = "accepted";
        matchStage.isActive = true;
    }

    let product = await redisClient.get(key);
    // console.log(product)
    if (product) 
        return res.json(
            new ApiResponse(
                200,
                JSON.parse(product),
                "Product fetched successfully",
            ),
        );

    product = await productService.getProduct(matchStage);

    if (!product) throw new ApiError(404, "Product not found");

    await redisClient.set(key, JSON.stringify(product));
    await redisClient.expire(key, 60 * 5);

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

    await redisClient.del(`vendor:product:${slug}`);

    res.json(new ApiResponse(200, product, "Product updated successfully"));
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

const getCartProducts = asyncHandler(async (req, res) => {
    const { products } = req.body;

    const allProducts = await productService.getCartProducts(
        Object.keys(products),
    );

    res.json(
        new ApiResponse(200, allProducts, "Products fetched successfully"),
    );
});

const getFilteredProducts = asyncHandler(async (req, res) => {
    const { page } = req.params;
    const filterQueries = req.query;
    const { searchQuery } = filterQueries;

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
    getCartProducts,
    // getAllVendorProducts,
    // getAllProductsSuperAdmin,
    addVendorProduct,
    updateVendorProduct,
    updateProductStatus,
    getFilteredProducts,
};
