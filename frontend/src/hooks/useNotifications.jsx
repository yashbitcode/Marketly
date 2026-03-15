import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import NotificationApi from "../apis/notificationApi";
import { useCallback } from "react";

const useNotifications = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { isPending, error, isError, data } = useQuery({
        queryKey: ["notifications", user._id],
        queryFn: () => NotificationApi.getAll(),
    });

    const mutation = useMutation({
        mutationKey: ["notifications", user._id],
        mutationFn: (notificationId) => NotificationApi.markAsRead(notificationId),
    });

    const setNewNotification = useCallback(
        (notification) => {
            queryClient.setQueryData(["notifications", user._id], (prev) => ({
                ...prev,
                data: [notification, ...prev.data],
            }));
        },
        [user, queryClient],
    );

    const setNotificationAsRead = useCallback(
        (notificationId) => {
            queryClient.setQueryData(["notifications", user._id], (prev) => {
                const newNotifications = prev?.data?.filter((el) => el._id !== notificationId);

                mutation.mutate(notificationId);

                return {
                    ...prev,
                    data: newNotifications,
                };
            });
        },
        [user, queryClient, mutation],
    );

    return {
        loading: isPending,
        error: error?.message,
        isError,
        notifications: data?.data || [],
        setNewNotification,
        setNotificationAsRead,
    };
};

export default useNotifications;
