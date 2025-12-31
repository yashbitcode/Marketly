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
}

module.exports = new ProductService();
