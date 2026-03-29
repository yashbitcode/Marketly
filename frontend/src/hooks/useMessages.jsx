import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatApi } from "../apis";
import { useCallback } from "react";

const useMessages = (chatId) => {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["messages", chatId],
        queryFn: () => ChatApi.getMessages(chatId),
    });

    const setChatInfo = useCallback(
        (payload) => {
            queryClient.setQueryData(["messages", chatId], (prev) => ({
                ...prev,
                data: payload,
            }));
        },
        [chatId, queryClient],
    );

    return {
        data: data?.data,
        loading: isLoading,
        isError,
        error: error?.response?.data?.message,
        setChatInfo,
    };
};

export default useMessages;
