import z from "zod";
import { ORDER_DELIVERY_STATUS, REGEX } from "../constants.js";
import { productRecords } from "../baseValidations.js";

const updateOrderDeliveryStatusValidations = z.object({
    sellerOrderId: z.string({
        error: (iss) => !iss.input && "Order ID is required",
    }),
    deliveryStatus: z.enum(ORDER_DELIVERY_STATUS, "Invalid delivery status"),
});

const createOrderValidations = z.object({
    products: productRecords,
    prefills: z.object({
        name: z
            .string({
                error: (iss) => console.log(iss),
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
    shippingAddressId: z
        .string({
            error: (iss) => !iss.input && "Shipping address ID is required",
        })
        .refine((val) => REGEX.objectId.test(val), {
            message: "Invalid shipping address ID",
        }),
    notes: z
        .object({
            description: z.string(),
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
