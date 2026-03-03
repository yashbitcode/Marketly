import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const useVerifyToken = (verifyApi, token) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const verifyToken = useCallback(async () => {
        try {
            const res = await verifyApi(token);

            if (res.data.success) setLoading(false);
            else navigate("/login", { replace: true });
        } catch {
            navigate("/login", { replace: true });
        } finally {
            setLoading(false);
        }
    }, [navigate, token, verifyApi]);

    useEffect(() => {
        verifyToken();
    }, [token, verifyToken]);

    return { loading, navigate };
};

export default useVerifyToken;
