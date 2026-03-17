import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { ProductApi } from "../apis";

const useCartProducts = () => {
    const {user} = useAuth();
    const cartKeys = Object.keys(JSON.parse(localStorage.getItem("cart") || "{}"));
    
    const {isPending, isError, data, error} = useQuery({
        queryKey: ["cartProducts", user._id, cartKeys],
        queryFn: () => ProductApi.getCartProducts(JSON.parse(localStorage.getItem("cart") || "{}")),
        enabled: cartKeys.length > 0
    });

    return {
        loading: isPending,
        isError,
        error: error?.response?.data?.message,
        products: data?.data,
    }
}

export default useCartProducts;