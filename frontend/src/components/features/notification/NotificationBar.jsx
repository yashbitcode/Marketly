import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../../hooks";
import { Button } from "../../common";

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
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!ioRef.current) {
            const ioInst = io(import.meta.env.VITE_BACKEND_URL + "/notification", { withCredentials: true });
            ioRef.current = ioInst;
            ioInst.emit("join", user._id);

            ioInst.on("order-place-update", (notification) => {
                setNotifications((prev) => [notification, ...prev]);
            });
        }
    }, [user]);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    return (
        <div className="relative">
            {/* Bell Button */}
            <Button
                onClick={() => setOpen((o) => !o)}
                className="bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange justify-center items-center p-2 rounded-full"
            >
                <Bell strokeWidth={1.8} />
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-orange-500 text-white text-[10px] font-bold min-w-4 h-4 flex items-center justify-center rounded-full px-1">
                        {unreadCount}
                    </span>
                )}
            </Button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute -right-10 top-13 w-80 max-h-70 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="font-bold text-sm text-gray-900">Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
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

                                        {/* Unread dot */}
                                        {!n.isRead && (
                                            <div
                                                className={`w-2 h-2 rounded-full shrink-0 mt-1 ${config.dot}`}
                                            />
                                        )}
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
