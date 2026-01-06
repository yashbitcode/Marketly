const { asyncHandler } = require("../utils/asyncHandler");
const razorpayService = require("../services/razorpay.service");
const ApiResponse = require("../utils/api-response");
const productService = require("../services/product.service");
const orderService = require("../services/order.service");
const ApiError = require("../utils/api-error");

const createOrder = asyncHandler(async (req, res) => {
    const { products, prefills, notes } = req.body;

    const allProducts = await productService.getAll({
        slug: {
            $in: products.map((el) => el.slug),
        },
    });

    if (allProducts.length !== products.length)
        throw new ApiError(404, "Some products not found");

    let totalAmount = 0;

    allProducts.forEach(
        (el, idx) => (totalAmount += el.price * products[idx].quantity),
    );

    const payload = {
        amount: totalAmount * 100,
        currency: "INR",
    };

    const order = await razorpayService.createOrder(payload);
    
    const dbPayload = {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        name: "Marketly",
        description: "Pay Now And Get The Products",
        products,
        prefills,
        notes,
    };
    
    const dbOrder = await orderService.createOrder(dbPayload);

    res.json(new ApiResponse(201, dbOrder, "Order created successfully"));
});

module.exports = {
    createOrder,
};
