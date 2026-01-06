const rzp = require("../config/razorpay");

class RazorpayService {
    async createOrder(payload) {
        const order = await rzp.orders.create(payload);
        
        return order;
    }
};

module.exports = new RazorpayService();