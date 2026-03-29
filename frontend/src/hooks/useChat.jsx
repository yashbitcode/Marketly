import { useParams } from "react-router";
import useAuth from "./useAuth";
import { useState } from "react";
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

    const participantName = user?.currentRole === "vendor" ? chatReq?.vendor?.fullname : chatReq?.user?.fullname;

    const formattedMessages = useMemo(() => {
        const baseMsgs = {};

        messages?.forEach((message) => {
            const formattedDate = new Date(message.createdAt).toDateString();

            if (!baseMsgs[formattedDate]) baseMsgs[formattedDate] = [];

            baseMsgs[formattedDate].push(message);
        });

        return baseMsgs;
    }, [messages]);

    const handleSend = (e) => {
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
    };

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
        console.log(chatId);

        ioRef.current.emit("join", chatId);

        ioRef.current.on("receive-message", (message) => {
            setChatInfo?.({ messages: [...messages, message], chatReq });
        });

        ioRef.current.on("online-users", (users) => {
            setIsParticipantOnline(users?.length > 1 ? true : false);
        });

        ioRef.current.on("chat-ended", (updatedChatReq) => {
            console.log(updatedChatReq)
            setChatInfo?.({ messages: [...messages], chatReq: updatedChatReq });
            ioRef.current.disconnect();
        });

        return () => {
            ioRef.current.disconnect();
        };
    }, [loading, isError, user, chatId, setChatInfo, messages, chatReq]);

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