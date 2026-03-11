import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

const useVerifyToken = (verifyApi, token) => {
    const navigate = useNavigate();

    const { isLoading } = useQuery(["verifyToken", token], () => verifyApi(token), {
        enabled: !!token,
        onSuccess: (res) => {
            if (!res.success) {
                navigate("/login", { replace: true });
            }
        },
        onError: () => {
            navigate("/login", { replace: true });
        },
    });

    return { loading: isLoading, navigate };
};

export default useVerifyToken;
