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

    async updateOrder(filters = {}, payload) {
       try {
         const order = await Order.findOneAndUpdate(filters, payload);

        return order;
       } catch(e) {
        console.log(e);
       }
    }
}

module.exports = new OrderService();