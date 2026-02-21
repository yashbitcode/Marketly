import mongoose from "mongoose";
import {
    ORDER_STATUS,
    ORDER_DELIVERY_STATUS,
} from "../../../shared/constants.js";
import {
    productItemSchema,
    prefillsSchema,
    notesSchema,
    mediaSchema,
} from "../utils/baseSchemas.js";
import User from "./user.models.js";
import Address from "./address.models.js";
import OrderRefundApplication from "./orderRefundApplication.models.js";

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: [true, "User ID is required"],
        },
        orderId: {
            type: String,
            required: [true, "Order ID is required"],
        },
        paymentId: {
            type: String,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        amount: {
            type: Number,
            reuired: [true, "Amount is required"],
            min: [1, "Minimum amount should be 1"],
        },
        currency: {
            type: String,
            required: [true, "Currency is required"],
        },
        prefills: {
            type: new mongoose.Schema(prefillsSchema, { _id: false }),
            required: [true, "Prefills are required"],
        },
        notes: {
            type: [new mongoose.Schema(notesSchema, { _id: false })],
        },
        products: {
            type: Map,
            of: {
                type: Number,
                required: [true, "Quantity is required"],
                min: [1, "Minimum quantity should be 1"],
            },
            required: [true, "Products are required"],
            min: [1, "Minimum 1 product is necessary"],

            // type: [new mongoose.Schema(productItemSchema, { _id: false })],
            // required: [true, "Products are required"],
            // min: [1, "Minimum 1 product is necessary"],
        },
        invoice: {
            type: new mongoose.Schema(mediaSchema, { _id: false }),
        },
        status: {
            type: String,
            enum: {
                values: ORDER_STATUS,
                message: "`{VALUE}` is not valid value",
            },
            default: "created",
        },
        shippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Address,
            required: [true, "Shipping address ID is required"],
        },
        refundApplication: {
            type: mongoose.Schema.Types.ObjectId,
            ref: OrderRefundApplication,
        },
        refundId: String,
    },
    {
        timestamps: true,
    },
);

const Order = mongoose.model("orders", OrderSchema);

export default Order;
