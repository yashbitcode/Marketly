const Order = require("../models/order.models");
const Product = require("../models/product.models");
const SellerOrder = require("../models/sellerOrder.models");
const { getIO } = require("../socket/socket.manager");
const util = require("node:util");

class OrderService {
    constructor() {
        this.io = getIO();
    }

    async createOrder(payload) {
        const {
            orderId,
            name,
            products,
            description,
            amount,
            currency,
            prefills,
            notes,
            user,
        } = payload;

        const order = new Order({
            orderId,
            name,
            products,
            description,
            amount,
            currency,
            prefills,
            notes,
            user,
        });

        await order.save();

        return order;
    }

    async createSellerOrders(orderDocId, user, products) {
        const productSlugs = Array.from(products.keys());

        const groupedProducts = await Product.aggregate([
            {
                $match: {
                    slug: {
                        $in: productSlugs,
                    },
                },
            },
            {
                $group: {
                    _id: "$vendor",
                    products: {
                        $push: {
                            product: "$_id",
                            quantity: {
                                $getField: {
                                    field: "$slug",
                                    input: products,
                                },
                            },
                        },
                    },
                },
            },
        ]);

        const orders = groupedProducts.map((el) => ({
            vendor: el._id,
            user,
            orderDocId,
            products: el.products,
        }));

        const sellerOrders = await SellerOrder.insertMany(orders);

        console.log(util.inspect(sellerOrders, {depth: null}));

        return sellerOrders;
    }

    async getOrder(filters = {}) {
        const order = Order.findOne(filters);

        return order;
    }

    async updateOrder(filters = {}, payload = {}) {
        const order = await Order.findOneAndUpdate(filters, payload, {new: true, runValidators: true});

        return order;
    }

    async sendOrderDeliveryUpdate(order) {
        this.io
            .of("/order")
            .to("order:" + order.orderId)
            .emit("delivery-update", order);
    }
}

module.exports = new OrderService();
