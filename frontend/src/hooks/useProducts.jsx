import { useCallback, useState } from "react";
import { useSearchParams } from "react-router";
import { PAGINATION_LIMIT } from "../../../shared/constants";
import { ProductApi } from "../apis";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useProducts = () => {
    // const [products, setProducts] = useState(null);
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();
    // const [pageError, setPageError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(() => searchParams.get("searchQuery") || "");

    const { isPending, isError, error, data } = useQuery({
        queryKey: ["products", page, Object.fromEntries([...searchParams])],
        queryFn: async () => {
            const { data } = await ProductApi.getAllFilteredProducts(
                Object.fromEntries([...searchParams]),
                page,
            );

            if (Math.ceil(data?.totalCount || 1 / PAGINATION_LIMIT) >= page)
                return data?.data ? data : [];
            else throw new Error("Invalid Page Number");
        },
    });

    const pageHandler = useCallback((pageNum) => {
        setPage(pageNum);
    }, []);

    const searchHandler = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    const setProducts = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["products", page, searchParams] });
    }, [page, searchParams, queryClient]);

    return {
        products: data,
        setProducts,
        loading: isPending,
        isError,
        error: error?.response?.data?.message,
        pageHandler,
        setSearchParams,
        searchParams,
        page,
        search,
        searchHandler,
    };
    // return {
    //     products,
    //     setProducts,
    //     pageError,
    //     pageHandler,
    //     setSearchParams,
    //     searchParams,
    //     page,
    //     search,
    //     searchHandler,
    // };
};

export default useProducts;
