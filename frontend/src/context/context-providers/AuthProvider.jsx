import { useCallback, useEffect, useState } from "react"
import AuthContext from "../AuthContext";
import { getAccessToken } from "../../utils/helpers";
import UserApi from "../../apis/userApi";

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setAuth = useCallback(({ mainUser }) => {
        setUser(mainUser);
        setLoading(false);
    }, []);

    // const logout = useCallback(() => {
    //     localStorage.removeItem("accessToken");
    //     localStorage.removeItem("refreshToken");
    // }, []);

    const checkAuth = useCallback(async () => {
        if(user) return;

       const token = getAccessToken()

        if (!token) {
            setAuth({ mainUser: null });
            return;
        }

        try {
            const res = await UserApi.me();
            setAuth({ mainUser: res.data.data });
        } catch {
            console.log("Error");
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }, [setAuth, user]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    // console.log(user)

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;