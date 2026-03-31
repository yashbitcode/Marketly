import { getFormatedStr } from "../../../utils/helpers";
import { Check, X, FileText, User, Mail, Calendar, Eye } from "lucide-react";
import { Button } from "../../common";

const VendorApplicationsTable = ({ applications, onStatusUpdate, loadingId }) => {
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] text-left font-inter border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-[11px] uppercase tracking-wider bg-gray-50/50">
                        <th className="p-4 font-bold">Business Info</th>
                        <th className="p-4 font-bold">Contact</th>
                        <th className="p-4 font-bold">Details</th>
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
                                        <div className="h-10 w-10 rounded-full bg-orange/10 flex items-center justify-center shrink-0 border border-orange/20">
                                            <User size={18} className="text-orange" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{app.storeName}</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                                                {app.vendorType}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Mail size={14} className="text-gray-400" />
                                            <span>{app.user?.email || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span>Joined {new Date(app.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1.5 grayscale opacity-75">
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                            <FileText size={12} />
                                            <span>Applicant: {app.fullname}</span>
                                        </div>
                                        <div className="text-xs text-gray-600 max-w-[200px] line-clamp-1 italic">
                                            "{app.description || "No description provided"}"
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 text-[11px] font-bold uppercase tracking-widest rounded-full border transition-all ${
                                            app.applicationStatus === "accepted"
                                                ? "bg-green-50 text-green-600 border-green-200"
                                                : app.applicationStatus === "rejected"
                                                ? "bg-red-50 text-red-600 border-red-200"
                                                : "bg-amber-50 text-amber-600 border-amber-200"
                                        }`}
                                    >
                                        {getFormatedStr(app.applicationStatus || "Pending")}
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
                                        {app.applicationStatus === "pending" ? (
                                            <>
                                                <Button
                                                    onClick={() => onStatusUpdate(app._id, "accepted")}
                                                    disabled={loadingId === app._id}
                                                    className="p-1.5 bg-green-500 text-white hover:bg-green-600 rounded-md shadow-md shadow-green-500/10 transition-all active:scale-95 disabled:opacity-50"
                                                    title="Approve"
                                                >
                                                    <Check size={14} strokeWidth={3} />
                                                </Button>
                                                <Button
                                                    onClick={() => onStatusUpdate(app._id, "rejected")}
                                                    disabled={loadingId === app._id}
                                                    className="p-1.5 bg-red-500 text-white hover:bg-red-600 rounded-md shadow-md shadow-red-500/10 transition-all active:scale-95 disabled:opacity-50"
                                                    title="Reject"
                                                >
                                                    <X size={14} strokeWidth={3} />
                                                </Button>
                                            </>
                                        ) : (
                                            <p className="text-[9px] text-gray-400 font-bold italic uppercase">Decision made</p>
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
                                    <p className="text-gray-500 font-medium">No vendor applications found.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VendorApplicationsTable;
