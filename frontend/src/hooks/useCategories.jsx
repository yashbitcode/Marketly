import { useEffect } from "react";
import { CategoryApi } from "../apis";
import { useQuery } from "@tanstack/react-query";
import { ErrorToast } from "../utils/toasts";

const useCategories = () => {
    const { isError, isPending, error, data } = useQuery({
        queryKey: ["category"],
        queryFn: CategoryApi.getAllCategories,
    });

    useEffect(() => {
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong");
    }, [isError, error]);

    return { categories: data?.data, loading: isPending };
};

export default useCategories;
