import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react"
import OrderApi from "../apis/orderApi";
import { PAGINATION_LIMIT } from "shared/constants";
import useAuth from "./useAuth";

const useBaseOrders = () => {
    const {user} = useAuth();
    const [page, setPage] = useState(1);

    const { isPending, isError, error, data } = useQuery({
        queryKey: ["orders", user._id, page],
        queryFn: async () => {
            const { data } = await OrderApi.getAll(
                page,
            );

            if (Math.ceil(data?.totalCount || 1 / PAGINATION_LIMIT) >= page)
                return data?.data ? data : [];
            else throw new Error("Invalid Page Number");
        },
        staleTime: 0
    });

    const pageHandler = useCallback((pageNum) => {
        setPage(pageNum);
    }, []);


    return {
        orders: data,
        loading: isPending,
        isError,
        error: error?.response?.data?.message,
        pageHandler,
        page,
    };
}

export default useBaseOrders;