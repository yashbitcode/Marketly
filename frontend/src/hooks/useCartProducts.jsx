import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { ProductApi } from "../apis";

const useCartProducts = () => {
    const {user} = useAuth();
    const {isPending, isError, data, error} = useQuery({
        queryKey: ["cartProducts", user._id],
        queryFn: () => ProductApi.getCartProducts(JSON.parse(localStorage.getItem("cart") || "{}"))
    });

    return {
        loading: isPending,
        isError,
        error: error?.response?.data?.message,
        products: data?.data,
    }
}

export default useCartProducts;