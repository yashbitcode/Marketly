import { useQuery } from "@tanstack/react-query";
import { ProductApi } from "../apis";

const useProduct = (slug) => {
    const { isPending, isError, error, data } = useQuery({
        queryKey: ["specific-product", slug],
        queryFn: () => ProductApi.getSpecific(slug),
        enabled: !!slug,
    });

    return {
        product: data,
        loading: isPending,
        isError,
        error: error?.response?.data?.message,
    };
};

export default useProduct;
