import { useCallback } from "react";
import AuthContext from "../AuthContext";
import { UserApi } from "../../apis";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();

    const { isError, isPending, error, data } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            console.log("Fetching user data...");
            return await UserApi.me();
        },
    });

    console.log({ isError, isPending, error, data });

    const setUser = useCallback(
        (mainUser) => {
            console.log(mainUser);
            queryClient.setQueryData(["user"], mainUser);
        },
        [queryClient],
    );

    return (
        <AuthContext.Provider
            value={{
                user: data?.data,
                loading: isPending,
                isError,
                error: error?.message,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
