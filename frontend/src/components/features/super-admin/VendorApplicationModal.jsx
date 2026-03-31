import { X, User, Store, Phone, Mail, FileText, Calendar, BadgeCheck, Type } from "lucide-react";
import { getFormatedStr } from "../../../utils/helpers";

const VendorApplicationModal = ({ application, onClose }) => {
    if (!application) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 px-4 font-inter">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-orange p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <Store size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">{application.storeName}</h3>
                            <p className="text-orange-100 text-xs font-medium uppercase tracking-widest">
                                Vendor Application Details
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <div className={`px-6 py-2 rounded-full border-2 flex items-center gap-2 font-bold text-sm uppercase tracking-widest ${
                            application.applicationStatus === "accepted"
                                ? "bg-green-50 border-green-200 text-green-600"
                                : application.applicationStatus === "rejected"
                                ? "bg-red-50 border-red-200 text-red-600"
                                : "bg-amber-50 border-amber-200 text-amber-600"
                        }`}>
                            <BadgeCheck size={18} />
                            {getFormatedStr(application.applicationStatus || "Pending")}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Business Info Section */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b pb-2">Business Presence</h4>
                            
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Type className="text-orange shrink-0 mt-1" size={18} />
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Vendor Type</p>
                                        <p className="text-sm font-semibold text-gray-900">{getFormatedStr(application.vendorType)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Store className="text-orange shrink-0 mt-1" size={18} />
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Store Name</p>
                                        <p className="text-sm font-semibold text-gray-900">{application.storeName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Section */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b pb-2">Contact Details</h4>
                            
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="text-orange shrink-0 mt-1" size={18} />
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Applicant Name</p>
                                        <p className="text-sm font-semibold text-gray-900">{application.fullname}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="text-orange shrink-0 mt-1" size={18} />
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email Address</p>
                                        <p className="text-sm font-semibold text-gray-900 break-all">{application.user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="text-orange shrink-0 mt-1" size={18} />
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Phone Number</p>
                                        <p className="text-sm font-semibold text-gray-900">{application.phoneNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Application Statement</h4>
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <div className="flex gap-3">
                                <FileText className="text-orange shrink-0" size={20} />
                                <p className="text-sm text-gray-700 leading-relaxed italic">
                                    "{application.description || "No statement provided"}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-black uppercase tracking-[0.15em] pt-4">
                        <div className="flex items-center gap-2">
                            <Calendar size={12} />
                            <span>Submitted: {new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                            ID: {application._id}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all shadow-sm active:scale-95"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorApplicationModal;
