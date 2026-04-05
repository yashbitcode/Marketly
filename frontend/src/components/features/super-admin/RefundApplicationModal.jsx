import { X, User, CreditCard, Phone, Mail, FileText, Calendar, BadgeCheck, ExternalLink, IndianRupee, Image as ImageIcon } from "lucide-react";
import { getFormatedStr, formatDate } from "../../../utils/helpers";
import { Button } from "../../common";

const RefundApplicationModal = ({ application, onClose }) => {
    if (!application) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 px-4 font-inter">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-orange p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">Refund Application</h3>
                            <p className="text-orange-100 text-xs font-medium uppercase tracking-widest">
                                Order: {application.order?.orderId || "N/A"}
                            </p>
                        </div>
                    </div>
                    <Button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full bg-transparent transition-colors"
                    >
                        <X size={24} />
                    </Button>
                </div>

                {/* Content with requested 4px padding (p-1) on the main wrapper if desired, 
                    but usually user means the sections. I'll use common sense for internal padding. */}
                <div className="p-1 max-h-[80vh] overflow-y-auto custom-scrollbar bg-gray-50/30">
                    <div className="p-7 space-y-8 bg-white rounded-[1.4rem]">
                        {/* Status Badge */}
                        <div className="flex justify-center">
                            <div className={`px-6 py-2 rounded-full border-2 flex items-center gap-2 font-bold text-sm uppercase tracking-widest ${
                                application.status === "refunded"
                                    ? "bg-green-50 border-green-200 text-green-600"
                                    : "bg-amber-50 border-amber-200 text-amber-600"
                            }`}>
                                <BadgeCheck size={18} />
                                {getFormatedStr(application.status || "Pending")}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* User Info Section */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b pb-2">Customer Profile</h4>
                                
                                <div className="flex items-center gap-4 mb-4">
                                    {application.user?.avatar?.url ? (
                                        <img 
                                            src={application.user.avatar.thumbnailUrl || application.user.avatar.url} 
                                            className="size-14 rounded-2xl object-cover border-2 border-orange/20"
                                            alt="avatar"
                                        />
                                    ) : (
                                        <div className="size-14 rounded-2xl bg-orange/10 flex items-center justify-center border-2 border-orange/20">
                                            <User size={24} className="text-orange" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{application.user?.fullname}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">@{application.user?.username}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Mail className="text-orange shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Email Address</p>
                                            <p className="text-xs font-semibold text-gray-700 break-all">{application.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="text-orange shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Contact Number</p>
                                            <p className="text-xs font-semibold text-gray-700">{application.user?.phoneNumber || application.order?.prefills?.phoneNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Info Section */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b pb-2">Order Transaction</h4>
                                
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <CreditCard className="text-orange shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Order ID</p>
                                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-tight">{application.order?.orderId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <IndianRupee className="text-orange shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Total Amount</p>
                                            <p className="text-xs font-bold text-gray-900">
                                                ₹{(application.order?.amount / 100).toLocaleString()} <span className="text-[10px] text-gray-400 font-normal uppercase">{application.order?.currency}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FileText className="text-orange shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Payment Status</p>
                                            <p className="text-xs font-semibold text-gray-700 uppercase">{application.order?.status}</p>
                                        </div>
                                    </div>
                                    {application.order?.invoice?.url && (
                                        <a 
                                            href={application.order.invoice.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center gap-2 mt-4 text-[10px] font-bold text-blue-500 hover:text-blue-600 uppercase tracking-widest"
                                        >
                                            <ExternalLink size={12} />
                                            View Official Invoice
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reason Section */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Refund Justification</h4>
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 italic">
                                <p className="text-sm text-gray-700 leading-relaxed uppercase">
                                    "{application.reason || "No reason provided"}"
                                </p>
                            </div>
                        </div>

                        {/* Attachments Section */}
                        {application.attachments?.length > 0 && (
                            <div className="space-y-4 pt-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Supporting Documents</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {application.attachments.map((file, idx) => (
                                        <a 
                                            key={idx} 
                                            href={file.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="group relative h-24 rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md"
                                        >
                                            <img 
                                                src={file.thumbnailUrl || file.url} 
                                                alt="attachment" 
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ImageIcon className="text-white" size={20} />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="flex justify-between items-center text-[9px] text-gray-400 font-black uppercase tracking-[0.15em] pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-2">
                                <Calendar size={12} />
                                <span>Applied: {formatDate(application.createdAt)}</span>
                            </div>
                            <div>
                                REF_ID: {application._id}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <Button
                        onClick={onClose}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95"
                    >
                        Dismiss
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RefundApplicationModal;
