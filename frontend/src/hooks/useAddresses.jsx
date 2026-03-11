import { useEffect } from "react";
import { AddressesApi } from "../apis";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { ErrorToast } from "../utils/toasts";

const useAddresses = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { isError, isPending, error, data } = useQuery({
        queryKey: ["addresses", user._id],
        queryFn: AddressesApi.getAll,
    });

    const invalidateAddresses = () => {
        queryClient.invalidateQueries(["addresses", user._id]);
    };

    useEffect(() => {
        if (isError) ErrorToast(error?.message || "Something went wrong");
    }, [error, isError]);

    return {
        addresses: data?.data,
        invalidateAddresses,
        loading: isPending,
        isError,
        error: error?.message,
    };
};

export default useAddresses;
