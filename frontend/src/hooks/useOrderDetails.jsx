import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import OrderApi from "../apis/orderApi";

const useOrderDetails = (orderId) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { isPending, isError, error, data } = useQuery({
        queryKey: ["specific-order", user.currentRole === "user" ? user._id : user.vendorId._id, orderId],
        queryFn: () => OrderApi.getSpecific(orderId),
    });

    const updateStatusMutation = useMutation({
        mutationFn: (payload) => OrderApi.updateStatus(payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["specific-order", user.currentRole === "user" ? user._id : user.vendorId._id, orderId]);
        },
    });

    const setUpdatedOrders = (updater) => {
        queryClient.setQueryData(["specific-order", user.currentRole === "user" ? user._id : user.vendorId._id, orderId], (prev) => {
            if (!prev) return prev;
            const currentOrder = prev.data;
            const updatedOrder = updater(currentOrder);
            return {
                ...prev,
                data: updatedOrder,
            };
        });
    };

    return {
        loading: isPending,
        isError,
        setUpdatedOrders,
        error: error?.response?.data?.message,
        order: data?.data,
        statusUpdateLoading: updateStatusMutation.isPending,
        handleUpdateStatus: updateStatusMutation.mutateAsync,
    };
};

export default useOrderDetails;