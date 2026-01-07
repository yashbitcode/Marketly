const Order = require("../models/order.models");
const { getIO } = require("../socket/socket.manager");

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
        });

        await order.save();

        return order;
    }

    async updateOrder(filters = {}, payload = {}) {
        const order = await Order.findOneAndUpdate(filters, payload);

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
