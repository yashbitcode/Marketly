import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, FileText, Truck } from "lucide-react";
import { formatDate, formatPrice } from "../utils/helpers";
import useOrderDetails from "../hooks/useOrderDetails";
import { Button } from "../components/common";
import { ErrorToast } from "../utils/toasts";
import ProductRow from "../components/features/order/ProductRow";
import DeliveryProgressBar from "../components/features/order/DeliveryProgressBar";
import InfoRow from "../components/features/order/InfoRow";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { loading, isError, error, order } = useOrderDetails(id);

    console.log(order);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-orange border-t-transparent rounded-full" />
            </div>
        );
    }

    if (isError || !order) {
        if (isError) ErrorToast(error);

        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                <Package size={48} className="mb-3 opacity-20" />
                <p>Order not found</p>
            </div>
        );
    }

    const { order: baseOrder, sellerOrders } = order;

    return (
        <div className="min-h-screen font-inter">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <Button
                    onClick={() => navigate(-1)}
                    className="flex bg-transparent p-0 items-center gap-2 text-sm text-gray-500 hover:text-orange transition-colors mb-5"
                >
                    <ArrowLeft size={16} /> Back to Orders
                </Button>

                {/* Header card */}
                <div className="bg-white rounded-lg p-5 shadow-base mb-4">
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <p className="text-xs text-gray-400 font-medium">{baseOrder.orderId}</p>
                            <p className="text-2xl font-black text-gray-900 mt-1.5">
                                ₹{formatPrice(baseOrder.amount)}
                            </p>
                        </div>
                        <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${
                                baseOrder.status === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "failed"
                                      ? "bg-red-100 text-red-600"
                                      : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                            {baseOrder.status?.toUpperCase()}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                        {formatDate(baseOrder.createdAt)}
                    </p>

                    {baseOrder.paymentId && (
                        <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                                Payment ID
                            </p>
                            <p className="text-xs font-mono font-semibold text-gray-600">
                                {baseOrder.paymentId}
                            </p>
                        </div>
                    )}
                </div>

                {(sellerOrders || []).map((so, i) => (
                    <div
                        key={so._id || i}
                        className="bg-white rounded-lg p-5 shadow-base mb-4"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Truck size={14} className="text-orange" />
                            <p className="text-sm font-bold text-gray-800">Shipment {i + 1}</p>
                            <span className="ml-auto text-xs bg-orange-50 text-orange font-semibold px-2 py-0.5 rounded-full capitalize">
                                {so.deliveryStatus?.replace(/_/g, " ")}
                            </span>
                        </div>

                        {/* Progress bar */}
                        <DeliveryProgressBar status={so.deliveryStatus} />

                        {/* Products in this shipment */}
                        <div className="mt-1">
                            {(so.products || []).map((p, j) => (
                                <ProductRow key={j} product={p.product} quantity={p.quantity} />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Order summary */}
                <div className="bg-white rounded-lg p-5 shadow-base mb-4">
                    <p className="text-sm font-bold text-gray-800 mb-3">Order Summary</p>
                    <InfoRow label="Order ID" value={baseOrder.orderId} />
                    <InfoRow label="Total Amount" value={`₹${formatPrice(baseOrder.amount)}`} />
                    <InfoRow label="Currency" value={baseOrder.currency} />
                    <InfoRow label="Placed on" value={formatDate(baseOrder.createdAt)} />
                </div>

                {/* Shipping address */}
                {baseOrder.shippingAddress && (
                    <div className="bg-white rounded-lg p-5 shadow-base mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin size={14} className="text-orange" />
                            <p className="text-sm font-bold text-gray-800">Shipping Address</p>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {baseOrder.shippingAddress.addressLine1},{" "}
                            {baseOrder.shippingAddress.city}, {baseOrder.shippingAddress.state} -{" "}
                            {baseOrder.shippingAddress.postalCode}
                        </p>
                    </div>
                )}

                {baseOrder.invoice && (
                    <Link
                        to={baseOrder.invoice.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-base  transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                            <FileText size={18} className="text-orange" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Download Invoice</p>
                            <p className="text-xs text-gray-400">{baseOrder.invoice.filename}</p>
                        </div>
                        <ArrowLeft
                            size={14}
                            className="ml-auto rotate-180 text-gray-300 group-hover:text-orange-400 transition-colors"
                        />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
