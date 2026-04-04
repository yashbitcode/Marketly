import { X, User, Mail, MessageSquare, Calendar, Paperclip, ExternalLink, Hash } from "lucide-react";
import { formatDate } from "../../../utils/helpers";

const SupportTicketModal = ({ ticket, onClose }) => {
    if (!ticket) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 px-4 font-inter text-gray-900">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-orange p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-2.5 rounded-2xl">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">Support Ticket</h3>
                            <p className="text-orange-100 text-[10px] font-bold uppercase tracking-[0.2em]">
                                Detailed Query Information
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* User Info & Query Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 border-b border-gray-100 pb-3">Sender Details</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <User className="text-orange shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Full Name</p>
                                        <p className="text-base font-bold text-gray-900">{ticket.fullname}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="text-orange shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Email Address</p>
                                        <p className="text-base font-bold text-gray-900 break-all">{ticket.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 border-b border-gray-100 pb-3">Query Context</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <Hash className="text-orange shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Query Type</p>
                                        <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-orange/10 text-orange border border-orange/20">
                                            {ticket.queryType}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Calendar className="text-orange shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Submission Date</p>
                                        <p className="text-base font-bold text-gray-900">
                                            {formatDate(ticket.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Section */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Inquiry Message</h4>
                        <div className="bg-gray-50/80 rounded-3xl p-6 md:p-8 border border-gray-100">
                            <p className="text-gray-700 leading-[1.8] text-sm font-medium whitespace-pre-wrap">
                                {ticket.message}
                            </p>
                        </div>
                    </div>

                    {/* Attachments Section */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                        <div className="space-y-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 flex items-center gap-2">
                                <Paperclip size={14} className="text-orange" />
                                Attachments ({ticket.attachments.length})
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {ticket.attachments.map((file, index) => (
                                    <a 
                                        key={file.fileId || index}
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-orange/30 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <img 
                                            src={file.thumbnailUrl || file.url} 
                                            alt={file.filename} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-orange/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <ExternalLink size={24} className="text-white" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metadata Footer */}
                    <div className="flex justify-between items-center text-[9px] text-gray-300 font-black uppercase tracking-[0.3em] pt-6 border-t border-gray-50">
                        <div>
                            TICKET ID · {ticket._id}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-10 py-4 bg-white border border-gray-200 text-gray-900 font-bold text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm active:scale-95"
                    >
                        Close Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupportTicketModal;
