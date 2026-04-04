import { Eye, Mail, User, Calendar, MessageSquare } from "lucide-react";
import { Button } from "../../common";
import { formatDate } from "../../../utils/helpers";

const SupportTicketsTable = ({ tickets, onViewDetails }) => {
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] text-left font-inter border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-[11px] uppercase tracking-wider bg-gray-50/50">
                        <th className="p-4 font-bold">User Info</th>
                        <th className="p-4 font-bold">Query Type</th>
                        <th className="p-4 font-bold">Message Preview</th>
                        <th className="p-4 font-bold">Date Submitted</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets?.length > 0 ? (
                        tickets.map((ticket) => (
                            <tr
                                key={ticket._id}
                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <User size={20} className="text-orange shrink-0 grayscale opacity-40 ml-1" />
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{ticket.fullname}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Mail size={12} className="text-gray-400" />
                                                <span>{ticket.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest rounded-full border bg-orange/5 text-orange border-orange/10">
                                        {ticket.queryType}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-600 max-w-[300px]">
                                        <MessageSquare size={14} className="text-gray-400 shrink-0" />
                                        <p className="truncate">{ticket.message}</p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span>{formatDate(ticket.createdAt, false)}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <Button
                                        onClick={() => onViewDetails(ticket)}
                                        className="p-1.5 bg-orange/5 text-orange hover:bg-orange hover:text-white rounded-md transition-all shadow-sm active:scale-95 border border-orange/10 ml-auto"
                                        title="View Details"
                                    >
                                        <Eye size={16} strokeWidth={2.5} />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-12 text-center">
                                <div className="flex flex-col items-center gap-3 opacity-30 grayscale">
                                    <MessageSquare size={48} />
                                    <p className="text-gray-500 font-medium">No support tickets found.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SupportTicketsTable;
