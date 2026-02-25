import { useCallback, useEffect, useState } from "react"
import AuthContext from "../AuthContext";

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setAuth = useCallback(({ mainUser }) => {
        setUser(mainUser);
        setLoading(false);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }, []);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setAuth({ mainUser: null });
            return;
        }

        try {
            const mainUser = {} //main user fetching
            setAuth({ mainUser });
        } catch {
            logout();
            console.log("Error");
        } finally {
            setAuth({ mainUser: null });
        }
    }, [setAuth, logout]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;