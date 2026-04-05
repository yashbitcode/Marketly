import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { RefundApplicationApi } from "../apis";

const useRefundApplications = () => {
    const [page, setPage] = useState(1);

    const { isPending, isError, error, data } = useQuery({
        queryKey: ["refund-applications", page],
        queryFn: async () => {
            const { data } = await RefundApplicationApi.getAll(page);
            return data;
        },
    });

    const pageHandler = useCallback((pageNum) => {
        setPage(pageNum);
    }, []);

    return {
        applications: data?.[0]?.data || [],
        totalCount: data?.[0]?.totalCount || 0,
        loading: isPending,
        isError,
        error: error?.response?.data?.message,
        pageHandler,
        page,
    };
};

export default useRefundApplications;
