import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import OrderApi from "../apis/orderApi";

const useOrderDetails = (orderId) => {
    const {user} = useAuth();
    const {isPending, isError, error, data} = useQuery({
        queryKey: ["specific-order", user._id, orderId],
        queryFn: () => OrderApi.getSpecific(orderId)
    });

    return {
        loading: isPending,
        isError,
        error: error?.response?.data?.message,
        order: data?.data
    }
};

export default useOrderDetails;