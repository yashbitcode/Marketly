import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { PAGINATION_LIMIT } from "../../../shared/constants";
import toast from "react-hot-toast";
import { ProductApi } from "../apis";

const useProducts = () => {
    const [products, setProducts] = useState(null);
    const [page, setPage] = useState(1);
    const [pageError, setPageError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(() => searchParams.get("searchQuery") || "");

    const pageHandler = (pageNum) => {
        setPage(pageNum);
    };

    const searchHandler = (e) => setSearch(e.target.value);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setPageError(null);

                const { data } = await ProductApi.getAllFilteredProducts(
                    Object.fromEntries([...searchParams]),
                    page,
                );

                if (Math.ceil(data?.data.totalCount || 1 / PAGINATION_LIMIT) >= page)
                    setProducts(data?.data || []);
                else setPageError("Invalid Page Number");
            } catch (err) {
                toast.error(err?.response?.data?.message || "Something went wrong", {
                    position: "right-top",
                });
            }
        };

        fetchProducts();
    }, [page, searchParams]);

    return {
        products,
        pageError,
        pageHandler,
        setSearchParams,
        searchParams,
        page,
        search,
        searchHandler,
    };
};

export default useProducts;
