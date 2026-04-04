import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

const useVerifyToken = (verifyApi, token) => {
    const navigate = useNavigate();

    const { isLoading, isError, error } = useQuery({
        queryKey: ["verifyToken", token],
        queryFn: () => verifyApi(token),
        enabled: !!token,
    });

    return { loading: isLoading, navigate, isError, error };
};

export default useVerifyToken;
