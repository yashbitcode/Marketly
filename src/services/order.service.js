const Order = require("../models/order.models");

class OrderService {
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
}

module.exports = new OrderService();