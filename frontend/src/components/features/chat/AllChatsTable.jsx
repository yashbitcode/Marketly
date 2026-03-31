import { MessageCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import { formatDate, getChatStatusStyle, getFormattedStatus } from "../../../utils/helpers";
import { useAuth } from "../../../hooks";

const AllChatsTable = ({ chats }) => {
    const { user: currentUser } = useAuth();

    return (
        <div className="overflow-x-auto w-full font-inter">
            <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase bg-gray-50/50">
                        <th className="p-4 font-medium">Participant</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Date Created</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {chats?.length > 0 ? (
                        chats.map((chat) => {
                            const isVendor = currentUser?.currentRole === "vendor";
                            const isAdmin = currentUser?.currentRole === "admin" || currentUser?.currentRole === "super-admin";
                            
                            let participantName = "";
                            let participantMeta = "";

                            if (isVendor) {
                                participantName = chat.user?.fullname || "Unknown User";
                                participantMeta = chat.user?.email || "";
                            } else if (isAdmin) {
                                participantName = `U: ${chat.user?.fullname || 'N/A'} ↔ V: ${chat.vendor?.storeName || 'N/A'}`;
                                participantMeta = `CID: ${chat.chatId || "No Chat ID"}`;
                            } else {
                                // Default for "user" role
                                participantName = chat.vendor?.storeName || chat.vendor?.fullname || "Unknown Store";
                                participantMeta = chat.vendor?.phoneNumber || "";
                            }

                            return (
                                <tr
                                    key={chat._id}
                                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                                >
                                    {/* Participant */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                <MessageCircle size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 capitalize">
                                                    {participantName}
                                                </p>
                                                {participantMeta && (
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {participantMeta}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${getChatStatusStyle(
                                                chat.status
                                            )}`}
                                        >
                                            {getFormattedStatus(chat.status)}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="p-4 text-sm text-gray-600">
                                        {formatDate(chat.createdAt)}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {chat.chatId ? (
                                                <Link
                                                    to={`/chat/${chat.chatId}`}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-green text-amber-200 text-xs font-bold rounded-lg hover:bg-green/90 transition-all shadow-sm"
                                                >
                                                    Open Chat <ExternalLink size={14} />
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No Active Chat</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-8 text-center text-gray-500">
                                No chat history found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllChatsTable;
