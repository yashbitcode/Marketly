import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "../../../utils/helpers";
import { IndianRupee, DollarSign, ExternalLink, User, ShoppingBag, Landmark } from "lucide-react";
import { VendorPayoutApi } from "../../../apis";
import { SuccessToast, ErrorToast } from "../../../utils/toasts";
import { Button } from "../../common";

const VendorPayoutsTable = ({ payouts }) => {
    const queryClient = useQueryClient();

    const transferMutation = useMutation({
        mutationFn: (id) => VendorPayoutApi.makeTransfer(id),
        onSuccess: (res) => {
            SuccessToast(res.message);
            queryClient.invalidateQueries(["vendor-payouts"]);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Transfer failed"),
    });

    const payoutMutation = useMutation({
        mutationFn: (id) => VendorPayoutApi.makePayout(id),
        onSuccess: (res) => {
            SuccessToast(res.message);
            queryClient.invalidateQueries(["vendor-payouts"]);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Payout failed"),
    });

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] text-left font-inter border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-[11px] uppercase tracking-wider bg-gray-50/50">
                        <th className="p-4 font-bold">Payout Details</th>
                        <th className="p-4 font-bold">Order Info</th>
                        <th className="p-4 font-bold">Vendor Info</th>
                        <th className="p-4 font-bold">Amount</th>
                        <th className="p-4 font-bold text-center">Status</th>
                        <th className="p-4 font-bold text-right">Actions</th>
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
                                <td className="p-4 text-center">
                                    <span
                                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm ${
                                            p.isPaid
                                                ? "bg-green-50 text-green-600 border-green-200"
                                                : p.transferId
                                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                                : "bg-amber-50 text-amber-600 border-amber-200"
                                        }`}
                                    >
                                        {p.isPaid ? "Paid" : p.transferId ? "Transferred" : "Pending"}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end px-2">
                                        {!p.isPaid ? (
                                            <Button
                                                size="xs"
                                                className={`text-[9px] px-4 h-7 font-bold uppercase tracking-tight transition-all duration-200 hover:shadow-md border-none ${
                                                    p.transferId
                                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
                                                        : "bg-orange hover:bg-orange/90 text-white shadow-orange-100"
                                                }`}
                                                onClick={() =>
                                                    p.transferId
                                                        ? payoutMutation.mutate(p._id)
                                                        : transferMutation.mutate(p._id)
                                                }
                                                isLoading={
                                                    p.transferId
                                                        ? payoutMutation.isPending
                                                        : transferMutation.isPending
                                                }
                                            >
                                                {p.transferId ? "Initiate Payout" : "Initiate Transfer"}
                                            </Button>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                                                <div className="size-1.5 rounded-full bg-green-600 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-12 text-center text-gray-500 font-medium">
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
