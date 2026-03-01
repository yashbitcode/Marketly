import { Navigate, Outlet } from "react-router";
import useAuth from "../../../hooks/useAuth";

const Protected = ({authenticate = true}) => {
    const {user, loading} = useAuth();

    if(loading) return <div>Loading...</div>;

    if(user && !authenticate) return <Navigate to={"/dash"} replace />
    if(!user && authenticate) return <Navigate to={"/login"} replace />

    return <Outlet />;
}

export default Protected;