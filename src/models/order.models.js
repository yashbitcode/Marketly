const mongoose = require("mongoose");
const { ORDER_STATUS, ORDER_DELIVERY_STATUS } = require("../utils/constants");
const {
    productItemSchema,
    prefillsSchema,
    notesSchema,
} = require("../utils/baseSchemas");
const User = require("./user.models");
const Address = require("./address.models");

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
            required: [true, "Address ID is required"],
        }
    },
    {
        timestamps: true,
    },
);

const Order = mongoose.model("orders", OrderSchema);

module.exports = Order;

// {
//   amount: 1500,
//   amount_due: 1500,
//   amount_paid: 0,
//   attempts: 0,
//   created_at: 1767709809,
//   currency: 'INR',
//   entity: 'order',
//   id: 'order_S0ctir7yzJznXB',
//   notes: [],
//   offer_id: null,
//   receipt: null,
//   status: 'created'
// }
