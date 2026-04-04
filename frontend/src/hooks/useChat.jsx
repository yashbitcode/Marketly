import { useParams } from "react-router";
import useAuth from "./useAuth";
import { useCallback, useState } from "react";
import { useRef } from "react";
import useMessages from "./useMessages";
import { useMemo } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

const useChat = () => {
    const { chatId } = useParams();
    const { user } = useAuth();
    const [isParticipantOnline, setIsParticipantOnline] = useState(false);
    const ioRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [message, setMessage] = useState("");
    const {
        data: { messages, chatReq } = {},
        loading,
        isError,
        error,
        setChatInfo,
    } = useMessages(chatId);

    const participantName = user?.currentRole === "vendor" ? chatReq?.user?.fullname : chatReq?.vendor?.storeName || chatReq?.vendor?.fullname;

    const formattedMessages = useMemo(() => {
        const baseMsgs = {};

        messages?.forEach((message) => {
            const formattedDate = new Date(message.createdAt).toDateString();

            if (!baseMsgs[formattedDate]) baseMsgs[formattedDate] = [];

            baseMsgs[formattedDate].push(message);
        });

        return baseMsgs;
    }, [messages]);

    const handleSend = useCallback((e) => {
        e.preventDefault();

        if (!message.trim()) return;

        if (!ioRef?.current) return;

        ioRef.current?.emit("send-message", {
            senderId: user?.currentRole === "vendor" ? user?.vendorId?._id : user?._id,
            docModel: user?.currentRole === "vendor" ? "vendors" : "users",
            chatId,
            message,
        });

        setMessage("");
    }, [user, ioRef, message, setMessage, chatId]);

    console.log(messages)

    const handleEndChat = () => {
        if (user?.currentRole !== "vendor") return;

        if (window.confirm("Are you sure you want to end this chat?"))
            ioRef.current?.emit("end-chat", chatId);
    };

    useEffect(() => {
        if (loading || isError || ioRef.current) return;

        ioRef.current = io(import.meta.env.VITE_BACKEND_URL + "/chat", {
            withCredentials: true,
        });

        ioRef.current.emit("join", chatId);

        ioRef.current.on("receive-message", (message) => {
            setChatInfo?.((prev) => ({ ...prev, messages: [...(prev?.messages || []), message] }));
        });

        ioRef.current.on("online-users", (users) => {
            setIsParticipantOnline(users?.length > 1 ? true : false);
        });

        ioRef.current.on("chat-ended", (updatedChatReq) => {
            setChatInfo?.((prev) => ({ ...prev, chatReq: updatedChatReq }));
            ioRef.current.disconnect();
        });

        return () => {
             if (ioRef.current) {
                 ioRef.current.disconnect();
                 ioRef.current = null;
             }
        };
    }, [loading, isError, user, chatId, setChatInfo]);

    useEffect(() => {
        if (messagesEndRef.current)
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }, [messagesEndRef, formattedMessages]);

    return {
        loading,
        isError,
        error,
        chatReq,
        user,
        messages,
        formattedMessages,
        participantName,
        isParticipantOnline,
        message,
        setMessage,
        handleSend,
        handleEndChat,
        messagesEndRef,
    }
}

export default useChat;