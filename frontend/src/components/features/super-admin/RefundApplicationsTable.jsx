import { Check, FileText, User, Mail, Calendar, Eye, CreditCard } from "lucide-react";
import { Button } from "../../common";
import { formatDate, getFormatedStr } from "../../../utils/helpers";

const RefundApplicationsTable = ({ applications, onStatusUpdate, loadingId }) => {
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] text-left font-inter border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-[11px] uppercase tracking-wider bg-gray-50/50">
                        <th className="p-4 font-bold">User Info</th>
                        <th className="p-4 font-bold">Contact & Date</th>
                        <th className="p-4 font-bold">Refund Details</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications?.length > 0 ? (
                        applications.map((app) => (
                            <tr
                                key={app._id}
                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-orange/10 flex items-center justify-center shrink-0 border border-orange/20 overflow-hidden">
                                            {app.user?.avatar?.url ? (
                                                <img 
                                                    src={app.user.avatar.thumbnailUrl || app.user.avatar.url} 
                                                    alt={app.user.fullname} 
                                                    className="w-full h-full object-cover grayscale opacity-80"
                                                />
                                            ) : (
                                                <User size={18} className="text-orange" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{app.user?.fullname || app.user?.username || "Unknown"}</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                                                Role: {app.user?.role || "user"}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-gray-400" />
                                            <span>{app.user?.email || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span>Requested {formatDate(app.createdAt, false)}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold tracking-widest">
                                            <CreditCard size={12} />
                                            <span>Order: {app.order?.orderId || "N/A"}</span>
                                        </div>
                                        <div className="text-xs text-gray-600 max-w-[250px] uppercase line-clamp-1 italic">
                                            "{app.reason || "No reason provided"}"
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 text-[11px] font-bold uppercase tracking-widest rounded-full border transition-all ${
                                            app.status === "refunded"
                                                ? "bg-green-50 text-green-600 border-green-200"
                                                : "bg-amber-50 text-amber-600 border-amber-200"
                                        }`}
                                    >
                                        {getFormatedStr(app.status || "Pending")}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            onClick={() => onStatusUpdate(app, "view")}
                                            className="p-1.5 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md transition-all shadow-sm active:scale-95 border border-blue-200"
                                            title="View Details"
                                        >
                                            <Eye size={14} strokeWidth={2.5} />
                                        </Button>
                                        {app.status === "under-process" ? (
                                            <Button
                                                onClick={() => onStatusUpdate(app._id, "refunded")}
                                                disabled={loadingId === app._id}
                                                className="p-1.5 bg-green-500 text-white hover:bg-green-600 rounded-md shadow-md shadow-green-500/10 transition-all active:scale-95 disabled:opacity-50"
                                                title="Process Refund"
                                            >
                                                {loadingId === app._id ? (
                                                    <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <Check size={14} strokeWidth={3} />
                                                )}
                                            </Button>
                                        ) : (
                                            <p className="text-[9px] text-gray-400 font-bold italic uppercase">Refunded</p>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-12 text-center">
                                <div className="flex flex-col items-center gap-3 opacity-30 grayscale">
                                    <FileText size={48} />
                                    <p className="text-gray-500 font-medium">No refund requests found.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RefundApplicationsTable;
