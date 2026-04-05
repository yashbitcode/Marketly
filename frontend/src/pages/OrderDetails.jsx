import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, FileText, Truck, Upload, X } from "lucide-react";
import { formatDate, formatPrice } from "../utils/helpers";
import { useOrderDetails, useImageKitUpload } from "../hooks";
import { Button, Error } from "../components/common";
import { ErrorToast, SuccessToast } from "../utils/toasts";
import ProductRow from "../components/features/order/ProductRow";
import DeliveryProgressBar from "../components/features/order/DeliveryProgressBar";
import InfoRow from "../components/features/order/InfoRow";
import { useAuth } from "../hooks";
import { STATUS_STEPS } from "../utils/constants";
import { useEffect, useRef, useState, useMemo } from "react";
import { io } from "socket.io-client";
import Loader from "../components/loadings/Loader";
import { RefundApplicationApi } from "../apis";
import { Textarea } from "../components/common";


const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const ioRef = useRef(null);

    const { loading, isError, error, order, setUpdatedOrders, statusUpdateLoading, handleUpdateStatus } =
        useOrderDetails(id);

    const { handleUpload, progress } = useImageKitUpload();
    const [showRefundForm, setShowRefundForm] = useState(false);
    const [refundReason, setRefundReason] = useState("");
    const [refundLoading, setRefundLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploadPending, setIsUploadPending] = useState(false);

    const filePreviews = useMemo(() => {
        return selectedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            url: URL.createObjectURL(file)
        }));
    }, [selectedFiles]);

    useEffect(() => {
        return () => {
            filePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, [filePreviews]);

    const onStatusChange = async (sellerOrderId, newStatus) => {
        if (statusUpdateLoading) return;

        const isConfirmed = window.confirm(
            `Are you sure you want to change the delivery status to ${newStatus.replace(/_/g, " ")}?`,
        );

        if (!isConfirmed) return;

        try {
            await handleUpdateStatus({ sellerOrderId, deliveryStatus: newStatus });
            SuccessToast("Status updated successfully");
        } catch (err) {
            ErrorToast(err?.response?.data?.message || "Failed to update status");
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 5) {
            return ErrorToast("Maximum 5 attachments allowed");
        }
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeAttachment = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleRefundRequest = async () => {
        if (!refundReason.trim()) return ErrorToast("Please provide a reason for the refund");
        if (refundReason.trim().length < 10) return ErrorToast("Reason must be at least 10 characters long");

        setRefundLoading(true);
        setIsUploadPending(selectedFiles.length > 0);

        try {
            let uploadedAttachments = [];
            
            if (selectedFiles.length > 0) {
                const uploadPromises = await handleUpload(selectedFiles, {}, "refund-attachments");
                uploadedAttachments = await Promise.all(uploadPromises);
            }

            await RefundApplicationApi.create({
                order: order?.baseOrder?._id,
                reason: refundReason,
                attachments: uploadedAttachments
            });

            SuccessToast("Refund application submitted successfully");
            setShowRefundForm(false);
            setRefundReason("");
            setSelectedFiles([]);
        } catch (err) {
            ErrorToast(err?.response?.data?.message || "Failed to submit refund application");
        } finally {
            setRefundLoading(false);
            setIsUploadPending(false);
        }
    };

    useEffect(() => {
        if (!ioRef.current && order?.sellerOrders?.length > 0) {
            const ioInst = io(import.meta.env.VITE_BACKEND_URL + "/order", {
                withCredentials: true,
            });
            ioRef.current = ioInst;

            order?.sellerOrders?.forEach((so) => {
                ioInst.emit("join", so._id);
            });

            ioInst.on("delivery-update", (update) => {
                setUpdatedOrders((prevOrder) => {
                    const sellerOrders = [...prevOrder.sellerOrders].map((so) => {
                        if (so._id === update._id) return { ...so, deliveryStatus: update.deliveryStatus };
                        return so;
                    });
                    return { ...prevOrder, sellerOrders };
                });
            });
        }
    }, [ioRef, order, setUpdatedOrders]);

    if (loading) return <Loader />;

    if (isError || error) return <Error error={error} />;

    const { baseOrder, sellerOrders } = order;

    const vendorAmount =
        sellerOrders?.length > 0
            ? sellerOrders[0].products.reduce((acc, product) => {
                  const price = product?.product?.price || 0;
                  const quantity = product?.quantity || 0;
                  return acc + price * quantity;
              }, 0)
            : 0;

    const allDelivered = sellerOrders?.length > 0 && sellerOrders.every((so) => so.deliveryStatus === "delivered");

    return (
        <div className="min-h-screen font-inter">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <Button
                    onClick={() =>
                        navigate(user.currentRole === "user" ? "/orders" : "/vendor/orders")
                    }
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
                                ₹
                                {user?.currentRole === "vendor"
                                    ? formatPrice(vendorAmount)
                                    : formatPrice(baseOrder.amount / 100)}
                            </p>
                        </div>
                        <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${
                                baseOrder.status === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : baseOrder.status === "failed"
                                      ? "bg-red-100 text-red-600" 
                                      : baseOrder.status === "refunded" ? "bg-gray-100 text-gray-700" 
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
                    <div key={so._id || i} className="bg-white rounded-lg p-5 shadow-base mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Truck size={14} className="text-orange" />
                            <p className="text-sm font-bold text-gray-800">Shipment {i + 1}</p>
                            {user?.currentRole === "vendor" ? (
                                <select
                                    disabled={statusUpdateLoading}
                                    value={so.deliveryStatus}
                                    onChange={(e) => onStatusChange(so._id, e.target.value)}
                                    className="ml-auto text-xs bg-orange-50 text-orange font-semibold px-2 py-1 rounded-lg border-none outline-none cursor-pointer focus:ring-1 focus:ring-orange/50 transition-all disabled:opacity-50"
                                >
                                    {STATUS_STEPS.map((step) => (
                                        <option key={step.key} value={step.key}>
                                            {step.label}
                                        </option>
                                    ))}
                                    <option value="returned">Returned</option>
                                </select>
                            ) : (
                                <span className="ml-auto text-xs bg-orange-50 text-orange font-semibold px-2 py-0.5 rounded-full capitalize">
                                    {so.deliveryStatus?.replace(/_/g, " ")}
                                </span>
                            )}
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

                <div className="bg-white rounded-lg p-5 shadow-base mb-4">
                    <p className="text-sm font-bold text-gray-800 mb-3">Order Summary</p>
                    <InfoRow label="Order ID" value={baseOrder.orderId} />
                    <InfoRow
                        label="Total Amount"
                        value={`₹${user?.currentRole === "vendor" ? formatPrice(vendorAmount) : formatPrice(baseOrder.amount / 100)}`}
                    />
                    <InfoRow label="Currency" value={baseOrder.currency} />
                    <InfoRow label="Placed on" value={formatDate(baseOrder.createdAt)} />

                    {user?.currentRole === "user" &&
                        allDelivered &&
                        baseOrder.status === "paid" && !baseOrder.refundApplication && (
                            <div className="mt-4 pt-4">
                                {!showRefundForm ? (
                                    <Button
                                        onClick={() => setShowRefundForm(true)}
                                        className="w-full bg-orange-50 text-orange border border-orange/20 hover:bg-orange/10 transition-colors font-bold py-2.5"
                                    >
                                        Request Refund / Return
                                    </Button>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold text-gray-700">Reason for Request</p>
                                        <Textarea
                                            value={refundReason}
                                            onChange={(e) => setRefundReason(e.target.value)}
                                            placeholder="Please describe why you are requesting a refund or return..."
                                            rows={3}
                                            className="text-sm border-gray-200 focus:border-orange focus:ring-orange/20 transition-all rounded-lg"
                                        />
                                        
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Supporting Images (Optional)</p>
                                            <div className="flex flex-wrap gap-2">
                                                {filePreviews.map((preview, index) => (
                                                    <div key={preview.id} className="relative size-16 group">
                                                        <img 
                                                            src={preview.url} 
                                                            className="w-full h-full object-cover rounded-lg border border-gray-100"
                                                            alt="refund preview"
                                                        />
                                                        <button 
                                                            onClick={() => removeAttachment(index)}
                                                            className="absolute -top-1 -right-1 bg-white shadow-md rounded-full p-0.5 text-red-500 hover:text-red-600 transition-colors"
                                                        >
                                                            <X size={12} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {selectedFiles.length < 5 && (
                                                    <label className={`size-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${isUploadPending ? 'opacity-50 pointer-events-none' : ''}`}>
                                                        <Upload size={16} className="text-gray-300" />
                                                        <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">Add</span>
                                                        <input 
                                                            type="file" 
                                                            multiple 
                                                            onChange={handleFileChange} 
                                                            className="hidden" 
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                onClick={() => {
                                                    setShowRefundForm(false);
                                                    setSelectedFiles([]);
                                                }}
                                                className="flex-1 bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors py-2.5 rounded-lg font-bold text-xs"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                disabled={refundLoading || isUploadPending}
                                                onClick={handleRefundRequest}
                                                className="flex-1 bg-orange hover:bg-orange/90 transition-colors text-white py-2.5 rounded-lg font-bold text-xs shadow-md shadow-orange/10"
                                            >
                                                {refundLoading ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        <span>{isUploadPending ? "Uploading..." : "Submitting..."}</span>
                                                    </div>
                                                ) : "Submit Refund Request"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
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

                {user?.currentRole !== "vendor" && baseOrder.invoice && (
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

/* 
checkout -> email (invoices) -> order(realtime) -> chat -> vendor-application -> admin approvals -> vendor flow -> stripe flow -> payouts -> refunds -> super admin flows
*/