const Product = require("../models/product.models");

class ProductService {
    async getAll(filters = {}) {
        const products = await Product.find(filters)
            .populate("vendor")
            .populate({
                path: "vendor",
                populate: {
                    path: "parentCategory",
                },
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
            vendor: vendorId,
        });
        
        await product.save();

        return product;
    }
}

module.exports = new ProductService();
