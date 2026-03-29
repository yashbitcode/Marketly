import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth, useNotifications } from "../../../hooks";
import { Button } from "../../common";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ChatApi } from "../../../apis";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";

const typeConfig = {
    ORDER_UPDATE: {
        pill: "bg-orange-100 text-orange-500",
        dot: "bg-orange-500",
        card: "bg-orange-50",
        icon: "🛒",
    },
    CHAT_REQUEST_UPDATE: {
        pill: "bg-blue-100 text-blue-500",
        dot: "bg-blue-500",
        card: "bg-blue-50",
        icon: "💬",
    },
    GENERAL_UPDATE: {
        pill: "bg-gray-100 text-gray-500",
        dot: "bg-gray-500",
        card: "bg-gray-50",
        icon: "🔔",
    },
    DEFAULT: {
        pill: "bg-sky-100 text-sky-500",
        dot: "bg-sky-500",
        card: "bg-sky-50",
        icon: "🔔",
    },
};

const NotificationBar = () => {
    const { user } = useAuth();
    const ioRef = useRef();
    const navigate = useNavigate();
    const { loading, notifications, setNewNotification, setNotificationAsRead } =
        useNotifications();

    const mutation = useMutation({
        mutationFn: (payload) => ChatApi.updateChatRequest(payload),
        onSuccess: (res) => {
            SuccessToast(res.message);
            if(res?.data?.status === "accepted") navigate(`/chat/${res.data.chatId}`);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Something went wrong"),
    });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!ioRef.current) {
            const ioInst = io(import.meta.env.VITE_BACKEND_URL + "/notification", {
                withCredentials: true,
            });
            ioRef.current = ioInst;
            ioInst.emit("join", user.currentRole === "vendor" ? user.vendorId._id : user._id);

            ioInst.on("order-place-update", (notification) => {
                setNewNotification?.(notification)
            });

            ioInst.on("chat-request-update", (notification) => {
                setNewNotification?.(notification)
            });
        }
    }, [user, setNewNotification]);

    // console.log(notifications);

    return (
        <div className="relative font-inter">
            <Button
                onClick={() => setOpen((o) => !o)}
                className="bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange justify-center items-center p-2 rounded-full relative group"
            >
                <Bell strokeWidth={1.8} />
                {!loading && notifications?.length > 0 && (
                    <div className="size-2 group-hover:border top-1.5 right-3 rounded-full absolute bg-orange" />
                )}
            </Button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute -right-10 top-13 w-80 max-h-70 bg-white rounded-lg shadow-base z-50 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="font-bold text-sm text-gray-900">Notifications</span>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <Bell size={32} className="mb-2 opacity-30" />
                                <span className="text-xs">No notifications yet</span>
                            </div>
                        ) : (
                            notifications.map((n, i) => {
                                const config = typeConfig[n.notificationType] || typeConfig.DEFAULT;
                                return (
                                    <div
                                        key={n._id || i}
                                        className={`px-4 py-3 border-b border-gray-50 transition-colors ${
                                            n.isRead ? "bg-white" : config.card
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-base shrink-0">
                                                {config.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-bold text-xs text-gray-900 truncate">
                                                        {n.title}
                                                    </span>
                                                    <span
                                                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap ${config.pill}`}
                                                    >
                                                        {n.notificationType}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed wrap-break-words m-0">
                                                    {n.message}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-2.5 pl-12 flex gap-2">
                                            {n.notificationType === "CHAT_REQUEST_UPDATE" ? (
                                                <>
                                                    <Button
                                                        className="text-[10px] h-7 px-3 bg-green-500 hover:bg-green-600 border-none"
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            console.log(n)
                                                            // setNotificationAsRead(n._id);
                                                            mutation.mutate({chatReqId: n?.data?.chatReqId, status: "accepted"});
                                                            // setOpen(false);
                                                        }}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        className="text-[10px] h-7 px-3 border-red-500 text-red-500 hover:bg-red-50"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setNotificationAsRead(n._id);
                                                            mutation.mutate({chatReqId: n.chatReqId, status: "accepted"});
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    className="text-[10px] h-7 px-4 border-gray-400 text-gray-600 hover:bg-gray-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (
                                                            n.notificationType === "ORDER_UPDATE" &&
                                                            n.data?.orderDocId
                                                        ) {
                                                            navigate(
                                                                "/orders/" + n.data.orderDocId,
                                                            );
                                                        }
                                                        setNotificationAsRead(n._id);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBar;
