import { useCallback, useEffect, useState } from "react";
import { ReviewApi } from "../apis";
import { ErrorToast } from "../utils/toasts";
import { useQuery } from "@tanstack/react-query";

const useReviews = (slug) => {
    const [page, setPage] = useState(1);

    const { isPending, isError, error, data } = useQuery({
        queryKey: ["reviews", slug, page],
        queryFn: () => ReviewApi.getAll(slug, page),
    });

    const pageHandler = useCallback((pageNum) => {
        setPage(pageNum);
    }, []);

    useEffect(() => {
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong");
    }, [error, isError]);

    return { reviews: data?.data, page, pageHandler, loading: isPending };
};

export default useReviews;
