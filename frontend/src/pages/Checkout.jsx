import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderValidations } from "../../../shared/validations/order.validations";
import { Input, Textarea, Button } from "../components/common";
import { useCallback, useEffect } from "react";
import AddressSection from "../components/features/address/AddressSection";
import { useAuth, useCartProducts } from "../hooks";
import { formatPrice } from "../utils/helpers";
import { useMutation } from "@tanstack/react-query";
import OrderApi from "../apis/orderApi";
import { useRazorpay} from "react-razorpay";


const CheckoutPage = () => {
    const { user } = useAuth();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(createOrderValidations),
    });

    const products = useWatch({
        name: "products",
        control,
    });

    const { products: productsCart } = useCartProducts();
    const { Razorpay } = useRazorpay();

    const mutation = useMutation({
        mutationKey: ["order", user._id],
        mutationFn: async (payload) => {
            const { products, prefills, shippingAddressId, notes } = payload;
            const { data: {dbOrder: data, rzpId} } = await OrderApi.create({
                products,
                prefills,
                shippingAddressId,
                notes,
            });
            
            const rzpOptions = {
                prefill: {
                    name: prefills.name,
                    email: prefills.email,
                    contact: prefills.phoneNumber,
                },
                notes,
                handler: (response) => {
                    console.log(response);
                    alert("This step of Payment Succeeded");
                },
                key: rzpId,
                amount: data?.amount,
                currency: data?.currency,
                order_id: data?.orderId,
            };

            const rzpObj = new Razorpay(rzpOptions);
            rzpObj.open();
        },
    });

    const onSubmit = (data) => {
        console.log(data);
        mutation.mutate(data);
    };

    const addressSideEffect = useCallback(
        (addresses) => {
            const defaultAddress = addresses?.find((addr) => addr.isDefault);
            if (defaultAddress) setValue("shippingAddressId", defaultAddress._id);
            else setValue("shippingAddressId", null);
        },
        [setValue],
    );

    useEffect(() => {
        if (productsCart) {
            const cartItems = JSON.parse(localStorage.getItem("cart") || "{}");

            productsCart.forEach((el) => {
                if (el.stockQuantity === 0) delete cartItems[el.slug];
                else if (cartItems[el.slug] > el.stockQuantity)
                    cartItems[el.slug] = el.stockQuantity;
            });

            setValue("products", cartItems);
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    }, [productsCart, setValue]);

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3 space-y-4">
                    {/* contact */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h2 className="text-xl font-semibold mb-2">Contact</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Full name"
                                    {...register("prefills.name")}
                                    error={errors.prefills?.name?.message}
                                />
                                <Input
                                    label="Phone number"
                                    {...register("prefills.phoneNumber")}
                                    error={errors.prefills?.phoneNumber?.message}
                                />
                            </div>
                            <Input
                                label="Email address"
                                type="email"
                                {...register("prefills.email")}
                                error={errors.prefills?.email?.message}
                            />
                        </div>
                    </div>

                    <div>
                        <AddressSection sideEffect={addressSideEffect} />
                        {errors?.shippingAddressId?.message && (
                            <span className="text-red-500 text-[0.8rem] -mt-1">
                                {errors?.shippingAddressId?.message}
                            </span>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h2 className="text-xl font-semibold mb-3">Cart Items</h2>
                        <div className="space-y-3">
                            {productsCart?.map((product) => {
                                const quantity = products?.[product.slug] || 0;
                                if (!quantity) return null;

                                const handleDecrement = () => {
                                    const cart = { ...products };

                                    if (cart[product.slug] <= 1) delete cart[product.slug];
                                    else cart[product.slug] -= 1;

                                    localStorage.setItem("cart", JSON.stringify(cart));
                                    setValue("products", cart);
                                };

                                const handleIncrement = () => {
                                    const cart = { ...products };
                                    if (cart[product.slug] < product.stockQuantity) {
                                        cart[product.slug] = (cart[product.slug] || 0) + 1;
                                        localStorage.setItem("cart", JSON.stringify(cart));
                                        setValue("products", cart);
                                    }
                                };

                                return (
                                    <div
                                        key={product._id}
                                        className="flex items-center gap-3 py-2 border-b last:border-b-0"
                                    >
                                        {/* Image */}
                                        <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                            <img
                                                src={
                                                    product.images?.[0]?.thumbnailUrl ||
                                                    product.images?.[0]?.url
                                                }
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Name + Controls */}
                                        <div className="flex-1 w-full">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {product.name}
                                            </p>
                                            <div className="flex items-center gap-2 w-full mt-1.5">
                                                <Button
                                                    onClick={handleDecrement}
                                                    className="size-6 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors text-sm font-medium p-0 bg-transparent"
                                                >
                                                    −
                                                </Button>
                                                <span className="text-sm font-semibold text-gray-800 text-center">
                                                    {quantity}
                                                </span>
                                                <Button
                                                    onClick={handleIncrement}
                                                    disabled={quantity >= product.stockQuantity}
                                                    className="size-6 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed p-0 bg-transparent"
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <p className="text-sm font-semibold text-gray-900 shrink-0">
                                            {product.currency}
                                            {(product.price * quantity).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* notes */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h2 className="text-xl font-semibold mb-2">Notes</h2>
                        <Textarea
                            label="Order notes (optional)"
                            {...register("notes.description")}
                            error={errors.notes?.message}
                        />
                    </div>

                    {/* cta */}
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        className="w-full bg-green/90 active:bg-blue-800 text-white text-sm font-medium py-3 rounded-xl transition-colors shadow-base"
                    >
                        Place order · ₹
                        {formatPrice(
                            productsCart?.reduce((acc, curr) => {
                                const price = curr.price * products?.[curr.slug];
                                return acc + price;
                            }, 0) || 0,
                        )}
                    </Button>

                    <p className="text-center text-xs text-gray-400">
                        By placing your order, you agree to our{" "}
                        <span className="text-blue-500 cursor-pointer">Terms of Service</span>
                    </p>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-5 sticky top-6">
                        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>

                        {/* pricing */}
                        <div className="pt-2 space-y-2.5 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>
                                    ₹
                                    {formatPrice(
                                        productsCart?.reduce((acc, curr) => {
                                            const price = curr.price * products?.[curr.slug];
                                            return acc + price;
                                        }, 0) || 0,
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Shipping</span>
                                <span className="font-medium">Free</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t">
                                <span>Total</span>
                                <span>
                                    ₹
                                    {formatPrice(
                                        productsCart?.reduce((acc, curr) => {
                                            const price = curr.price * products?.[curr.slug];
                                            return acc + price;
                                        }, 0) || 0,
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* trust badges */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
                            <svg
                                className="w-3.5 h-3.5 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Secure checkout · SSL encrypted
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
