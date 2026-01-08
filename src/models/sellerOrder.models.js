const mongoose = require("mongoose");
const Vendor = require("./vendor.models");
const User = require("./user.models");
const Order = require("./order.models");
const { sellerOrderProductsSchema } = require("../utils/baseSchemas");
const { ORDER_DELIVERY_STATUS } = require("../utils/constants");

const SellerOrderSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Vendor,
        required: [true, "Vendor ID is required"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: [true, "User ID is required"],
    },
    orderDocId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Order,
        required: [true, "Order doc ID is required"],
    },
    products: {
        type: [new mongoose.Schema(sellerOrderProductsSchema, { _id: false })],
        required: [true, "Products are required"],
        min: [1, "Minimum 1 product is required"],
    },
    deliveryStatus: {
        type: String,
        enum: {
            values: ORDER_DELIVERY_STATUS,
            message: "`{VALUE}` is not valid value",
        },
    },
});

const SellerOrder = mongoose.model("seller-orders", SellerOrderSchema);

module.exports = SellerOrder;
