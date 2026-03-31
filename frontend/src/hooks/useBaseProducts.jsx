import { useCallback, useState } from "react";
import { PAGINATION_LIMIT } from "../../../shared/constants";
import { ProductApi } from "../apis";
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const useBaseProducts = () => {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    console.log(user)

    const { isPending, isError, error, data } = useQuery({
        queryKey: ["all-products", user.vendorId?._id || user._id, page],
        queryFn: async () => {
            const { data } = await ProductApi.getAll(page);

            const totalPages = Math.ceil((data?.totalCount || 1) / PAGINATION_LIMIT);
            if (totalPages >= page || page === 1)
                return data;
            else throw new Error("Invalid Page Number");
        },
        staleTime: 0
    });

    const pageHandler = useCallback((pageNum) => {
        setPage(pageNum);
    }, []);

    return {
        products: data,
        loading: isPending,
        isError,
        error: error?.response?.data?.message,
        pageHandler,
        page,
    };
};

export default useBaseProducts;
