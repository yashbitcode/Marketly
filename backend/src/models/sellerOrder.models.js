import mongoose from "mongoose";
import Vendor from "./vendor.models.js";
import User from "./user.models.js";
import Order from "./order.models.js";
import { sellerOrderProductsSchema } from "../utils/baseSchemas.js";
import { ORDER_DELIVERY_STATUS } from "../../../shared/constants.js";

const SellerOrderSchema = new mongoose.Schema(
    {
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
            type: [
                new mongoose.Schema(sellerOrderProductsSchema, { _id: false }),
            ],
            required: [true, "Products are required"],
            min: [1, "Minimum 1 product is required"],
        },
        deliveryStatus: {
            type: String,
            enum: {
                values: ORDER_DELIVERY_STATUS,
                message: "`{VALUE}` is not valid value",
            },
            default: "placed",
        },
    },
    { timestamps: true },
);

const SellerOrder = mongoose.model("seller-orders", SellerOrderSchema);

export default SellerOrder;
