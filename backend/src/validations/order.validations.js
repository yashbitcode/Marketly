import z from "zod";
import { ORDER_DELIVERY_STATUS, REGEX } from "../utils/constants.js";

const updateOrderDeliveryStatusValidations = z.object({
    sellerOrderId: z.string({
        error: (iss) => !iss.input && "Order ID is required",
    }),
    deliveryStatus: z.enum(ORDER_DELIVERY_STATUS, "Invalid delivery status"),
});

const createOrderValidations = z.object({
    products: z.record(
        z.string(),
        z.number().min(1, "Minimum 1 quantity is required"),
    ),
    prefills: z.object({
        name: z
            .string({
                error: (iss) => !iss.input && "Name is required",
            })
            .min(3, "Minimum length should be 3"),
        email: z
            .email({
                error: (iss) =>
                    !iss.input ? "Email is required" : "Invalid email",
            })
            .lowercase()
            .trim(),
        phoneNumber: z
            .string({
                error: (iss) => !iss.input && "Phone number is required",
            })
            .regex(REGEX.phoneNumber, "Invalid phone number"),
    }),
    notes: z
        .object({
            description: z.string().min(10, "Minimum length should be 10"),
        })
        .optional(),
});

const verifyPaymentValidations = z.object({
    razorpay_order_id: z.string({
        error: (iss) => !iss.input && "Order ID is required",
    }),
    razorpay_payment_id: z.string({
        error: (iss) => !iss.input && "Payment ID is required",
    }),
    razorpay_signature: z.string({
        error: (iss) => !iss.input && "Signature is required",
    }),
});

export {
    createOrderValidations,
    verifyPaymentValidations,
    updateOrderDeliveryStatusValidations,
};
