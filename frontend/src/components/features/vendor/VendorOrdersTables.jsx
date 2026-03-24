import { Eye } from "lucide-react";
import { Link } from "react-router";
import { formatDate, getDeliveryStatusStyle, getFormattedStatus, getTotalQuantity } from "../../../utils/helpers";

const VendorOrdersTable = ({ orders }) => {
    return (
        <div className="overflow-x-auto w-full font-inter">
            <table className="w-full min-w-[900px] text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase bg-gray-50/50">
                        <th className="p-4 font-medium">Order ID</th>
                        <th className="p-4 font-medium">Customer</th>
                        <th className="p-4 font-medium">Items</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Delivery Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.length > 0 ? (
                        orders.map((entry) => {
                            const order = entry.order;
                            const sellerOrder = entry.sellerOrders?.[0];

                            return (
                                <tr
                                    key={entry._id}
                                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                                >
                                    {/* Order ID */}
                                    <td className="p-4">
                                        <p className="text-sm font-semibold text-gray-900 font-mono tracking-tight">
                                            {order?.orderId || "—"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            #{entry._id?.slice(-6)?.toUpperCase()}
                                        </p>
                                    </td>

                                    {/* Customer */}
                                    <td className="p-4">
                                        <p className="text-sm font-medium text-gray-900">
                                            {order?.prefills?.name || "—"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {order?.prefills?.email || ""}
                                        </p>
                                    </td>

                                    {/* Items count */}
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            {getTotalQuantity(sellerOrder?.products)}{" "}
                                            {getTotalQuantity(sellerOrder?.products) === 1 ? "item" : "items"}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="p-4 text-sm text-gray-600">
                                        {formatDate(sellerOrder?.createdAt, false)}
                                    </td>

                                    {/* Delivery Status */}
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${getDeliveryStatusStyle(
                                                sellerOrder?.deliveryStatus
                                            )}`}
                                        >
                                            {getFormattedStatus(sellerOrder?.deliveryStatus)}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/vendor/orders/${sellerOrder?._id}`}
                                                title="View Order"
                                                className="p-1.5 bg-transparent shadow-none text-gray-400 hover:text-orange hover:bg-orange-50 rounded-md transition-colors"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-8 text-center text-gray-500">
                                No orders found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VendorOrdersTable;