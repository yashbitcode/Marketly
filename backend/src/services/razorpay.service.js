import rzp from "../config/razorpay/index.js";
import { verifyRazorpaySignature } from "../utils/helpers.js";

class RazorpayService {
    async createOrder(payload) {
        const order = await rzp.orders.create(payload);

        return order;
    }

    async refundAmount(paymentId, amount, notes) {
        try {
            const refund = await rzp.payments.refund(paymentId, {
                speed: "optimum",
                amount,
                notes,
            });

            return refund;
        } catch (err) {
            console.log(err);
        }
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

export default new RazorpayService();
