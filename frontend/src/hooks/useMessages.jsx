import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatApi } from "../apis";
import { useCallback } from "react";

const useMessages = (chatId) => {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["messages", chatId],
        queryFn: () => ChatApi.getMessages(chatId),
        // enabled: !!chatId,
        // staleTime: 0
    });

    const setChatInfo = useCallback(
        (updater) => {
            queryClient.setQueryData(["messages", chatId], (prev) => {
                const currentData = prev?.data;
                const newData = typeof updater === "function" ? updater(currentData) : updater;
                return {
                    ...prev,
                    data: newData,
                };
            });
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
