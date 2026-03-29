
import { Send, UserIcon, StoreIcon, X } from "lucide-react";
import { Container, Button, Error } from "../components/common";
import Loader from "../components/loadings/Loader";
import { useChat } from "../hooks";
import React from "react";

const Chat = () => {
    const {
        loading,
        isError,
        error,
        chatReq,
        user,
        formattedMessages,
        participantName,
        isParticipantOnline,
        message,
        setMessage,
        handleSend,
        handleEndChat,
        messagesEndRef,
    } = useChat()

    if (loading) return <Loader />;

    if (isError) return <Error error={error} />;

    return (
        <div className="py-8 font-inter">
            <Container className="max-w-4xl px-4 mx-auto h-[600px] flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Chat</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {user?.currentRole === "vendor" 
                                ? "Communicate and resolve customer queries" 
                                : "Communicate with the vendor regarding your queries"}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-stone-200 flex flex-col flex-1 min-h-0 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-slate-500">
                                {user?.currentRole === "vendor" ? (
                                    <UserIcon size={20} />
                                ) : (
                                    <StoreIcon size={20} />
                                )}
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900 capitalize">
                                    {participantName}
                                </h2>
                                {chatReq?.status === "accepted" && (
                                    <p
                                        className={`text-xs font-medium mt-0.5 ${isParticipantOnline ? "text-green-600" : "text-red-600"}`}
                                    >
                                        {isParticipantOnline ? "Online" : "Offline"}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {user?.currentRole === "vendor" && chatReq?.status === "accepted" && (
                                <Button
                                    onClick={handleEndChat}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border-2 border-stone-200 hover:bg-stone-50 hover:text-red-600 hover:border-red-200 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer"
                                    title="End Chat"
                                >
                                    <X size={16} /> End Chat
                                </Button>
                            )}
                        </div>
                    </div>

                    <div
                        className="flex-1 overflow-y-auto p-6 bg-stone-50/50 scrollbar-thin-custom space-y-6"
                        ref={messagesEndRef}
                    >
                        {Object.entries(formattedMessages).map(([dateStr, msgs]) => {
                            let displayDate = dateStr;
                            const today = new Date();
                            const yesterday = new Date(today);
                            yesterday.setDate(yesterday.getDate() - 1);

                            if (dateStr === today.toDateString()) {
                                displayDate = "Today";
                            } else if (dateStr === yesterday.toDateString()) {
                                displayDate = "Yesterday";
                            }

                            return (
                                <React.Fragment key={dateStr}>
                                    <div className="text-center">
                                        <span className="text-xs text-slate-400 font-bold bg-white px-3 py-1 rounded-full border border-stone-200 shadow-sm">
                                            {displayDate}
                                        </span>
                                    </div>
                                    {msgs.map((msg) => {
                                        const isOwn =
                                            msg.senderId ===
                                            (user?.currentRole === "vendor"
                                                ? user?.vendorId?._id
                                                : user?._id);
                                        return (
                                            <div
                                                key={msg._id}
                                                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[75%] sm:max-w-[60%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                                                >
                                                    <div
                                                        className={`px-4 py-3 shadow-sm ${
                                                            isOwn
                                                                ? "bg-green text-white rounded-2xl rounded-tr-sm"
                                                                : "bg-white text-slate-900 border border-stone-200 rounded-2xl rounded-tl-sm"
                                                        }`}
                                                    >
                                                        <p className="text-sm font-medium">
                                                            {msg.message}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`text-[10px] font-semibold mt-1.5 px-1 text-slate-400`}
                                                    >
                                                        {new Date(msg.createdAt).toLocaleTimeString(
                                                            [],
                                                            { hour: "2-digit", minute: "2-digit" },
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {chatReq?.status === "accepted" && (
                        <div className="p-4 bg-white border-t border-stone-200">
                            <form onSubmit={handleSend} className="flex items-center gap-3">
                                <div className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 flex items-center focus-within:ring-2 focus-within:ring-green/20 focus-within:border-green transition-all">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={!message.trim()}
                                    className="bg-green text-amber-200 border-2 border-green hover:bg-green/90 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50 transition-all shadow-sm"
                                >
                                    <Send size={18} />
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default Chat;
