const Product = require("../models/product.models");
const { PAGINATION_LIMIT } = require("../utils/constants");
const { getProductFilterationPipeline } = require("../utils/helpers");

class ProductService {
    async getAll(filters, page) {
        const products = await Product.find(filters)
            .populate("vendor")
            .populate({
                path: "category",
                populate: {
                    path: "parentCategory",
                },
            })
            .skip(PAGINATION_LIMIT * (page - 1))
            .limit(PAGINATION_LIMIT)
            .sort({
                createdAt: -1,
            });

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

    async getSearchedProducts(filters, searchQuery, page) {
        const searchedProducts = await Product.find({
            $text: {
                $search: searchQuery,
            },
            ...filters,
        })
            .populate("vendor")
            .populate({
                path: "category",
                populate: {
                    path: "parentCategory",
                },
            })
            .skip(PAGINATION_LIMIT * (page - 1))
            .limit(PAGINATION_LIMIT)
            .sort({
                createdAt: -1,
            });

        return searchedProducts;
    }

    async getFilteredProducts(filterQueries, page) {
        const pipeline = getProductFilterationPipeline(filterQueries);

        pipeline.push(...[
            {
                $skip: PAGINATION_LIMIT * (page - 1),
            },
            {
                $limit: PAGINATION_LIMIT,
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);

        const filteredProducts = await Product.aggregate(pipeline);

        return filteredProducts;
    }
}

module.exports = new ProductService();
