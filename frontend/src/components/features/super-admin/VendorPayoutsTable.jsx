import { formatPrice, getFormatedStr } from "../../../utils/helpers";
import { IndianRupee, DollarSign, ExternalLink, User, ShoppingBag, Landmark } from "lucide-react";

const VendorPayoutsTable = ({ payouts }) => {
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] text-left font-inter border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-[11px] uppercase tracking-wider bg-gray-50/50">
                        <th className="p-4 font-bold">Payout Details</th>
                        <th className="p-4 font-bold">Order Info</th>
                        <th className="p-4 font-bold">Vendor Info</th>
                        <th className="p-4 font-bold">Amount</th>
                        <th className="p-4 font-bold text-right">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {payouts?.length > 0 ? (
                        payouts.map((p) => (
                            <tr
                                key={p._id}
                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                                            <Landmark size={18} className="text-blue-500" />
                                        </div>
                                        <div>
                                            {/* <p className="font-bold text-gray-900 text-sm">Payout #{p._id.slice(-8).toUpperCase()}</p> */}
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                Created: {new Date(p.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-600 font-bold">
                                            <ShoppingBag size={14} className="text-gray-400" />
                                            {/* <span>Order #{p.order?._id.slice(-8).toUpperCase()}</span> */}
                                        </div>
                                        <p className="text-[10px] text-gray-400 opacity-60 uppercase font-black">
                                            Platform: Marketly
                                        </p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <User size={16} className="text-gray-400" />
                                        <span className="font-medium text-gray-900">{p.vendor?.storeName}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5">
                                            <IndianRupee size={15} className="text-gray-900" />
                                        
                                        <p className="text-base font-medium text-gray-900">
                                            {formatPrice(p.amount)}
                                        </p>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <span
                                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm ${
                                            p.status === "paid"
                                                ? "bg-green-50 text-green-600 border-green-200"
                                                : p.status === "failed"
                                                ? "bg-red-50 text-red-600 border-red-200"
                                                : "bg-amber-50 text-amber-600 border-amber-200"
                                        }`}
                                    >
                                        {getFormatedStr(p.status || "Pending")}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-12 text-center text-gray-500 font-medium">
                                No payouts found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VendorPayoutsTable;
