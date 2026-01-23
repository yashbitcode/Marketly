const Product = require("../models/product.models");
const { PAGINATION_LIMIT } = require("../utils/constants");
const {
    getProductFilterationPipeline,
    getPaginationBasePipeline,
    getProductBasePipeline,
} = require("../utils/helpers");

class ProductService {
    async getAll(matchStage = {}, page = 1) {
        const basePagination = getPaginationBasePipeline(+page);
        const baseProductPipeline = getProductBasePipeline();

        const [products] = await Product.aggregate([
            {
                $match: matchStage,
            },
            ...baseProductPipeline,
            ...basePagination,
        ]);

        return products;
    }

    async getProduct(filters = {}) {
        const products = await Product.findOne(filters)
            .populate("vendor")
            .populate({
                path: "vendor",
                populate: {
                    path: "parentCategory",
                },
            });

        return products;
    }

    async addProduct(vendorId, payload) {
        const {
            name,
            brandName,
            price,
            stockQuantity,
            category,
            description,
            pros,
            cons,
            keyFeatures,
            images,
            attributes,
        } = payload;

        const product = new Product({
            name,
            brandName,
            price,
            stockQuantity,
            category,
            description,
            pros,
            cons,
            keyFeatures,
            images,
            attributes,
            vendor: vendorId,
        });

        await product.save();

        return product;
    }

    async updateProduct(filters, payload) {
        const product = await Product.findOneAndUpdate(filters, payload, {
            new: true,
            runValidators: true,
        });

        return product;
    }

    async getFilteredProducts(matchStage = {}, filterQueries = {}, searchQuery = "", page = 1) {
        const basePagination = getPaginationBasePipeline(+page);
        const baseFilterPipeline = getProductFilterationPipeline(filterQueries);
        const baseProductPipeline = getProductBasePipeline();

        const [searchedProducts] = await Product.aggregate([
            {
                $match: {
                    ...matchStage,
                    ...(searchQuery && {$text: { $search: searchQuery }})
                },
            },
            ...baseProductPipeline,
            ...baseFilterPipeline,
            ...basePagination,
        ]);

        return searchedProducts;
    }

    // async getFilteredProducts(filterQueries, page) {
    //     const basePagination = getPaginationBasePipeline(+page);
    //     const baseFilterPipeline = getProductFilterationPipeline(filterQueries);
    //     const baseProductPipeline = getProductBasePipeline();

    //     const [filteredProducts] = await Product.aggregate([
    //         {
    //             $match: {
                    
    //             }
    //         },
    //         ...baseProductPipeline,
    //         ...baseFilterPipeline,
    //         ...basePagination,
    //     ]);

    //     return filteredProducts;
    // }
}

module.exports = new ProductService();
