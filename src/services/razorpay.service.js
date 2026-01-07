const rzp = require("../config/razorpay");
const { verifyRazorpaySignature } = require("../utils/helpers");

class RazorpayService {
    async createOrder(payload) {
        const order = await rzp.orders.create(payload);

        return order;
    }

    async verify(payload) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            payload;

        const isValidSignature = verifyRazorpaySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        );

        return isValidSignature;
    }
}

module.exports = new RazorpayService();
