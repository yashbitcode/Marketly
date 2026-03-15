import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth, useNotifications } from "../../../hooks";
import { Button } from "../../common";
import { useNavigate } from "react-router";

const typeConfig = {
    ORDER_UPDATE: {
        pill: "bg-orange-100 text-orange-500",
        dot: "bg-orange-500",
        card: "bg-orange-50",
        icon: "🛒",
    },
    DEFAULT: { pill: "bg-sky-100 text-sky-500", dot: "bg-sky-500", card: "bg-sky-50", icon: "🔔" },
};

const NotificationBar = () => {
    const { user } = useAuth();
    const ioRef = useRef();
    const navigate = useNavigate();
    const { loading, notifications, setNewNotification, setNotificationAsRead } =
        useNotifications();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!ioRef.current) {
            const ioInst = io(import.meta.env.VITE_BACKEND_URL + "/notification", {
                withCredentials: true,
            });
            ioRef.current = ioInst;
            ioInst.emit("join", user._id);

            ioInst.on("order-place-update", (notification) => setNewNotification?.(notification));
        }
    }, [user, setNewNotification]);

    console.log(notifications);

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
                                        className={`flex gap-3 px-4 py-3 border-b border-gray-50 transition-colors ${
                                            n.isRead ? "bg-white" : config.card
                                        }`}
                                        onClick={() => {
                                            navigate("/orders/" + n.data.orderDocId);
                                            setNotificationAsRead(n._id);
                                            setOpen(false);
                                        }}
                                    >
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
