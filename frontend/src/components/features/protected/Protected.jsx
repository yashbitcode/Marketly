import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../../hooks";
import Loader from "../../loadings/Loader";

const Protected = ({ authenticate = true, allowedRoles }) => {
    const { user, loading } = useAuth();
// console.log(user);

    if (loading) return <Loader />;

    if (!user && authenticate) return <Navigate to={"/login"} replace />;
    if (user && (!authenticate || (allowedRoles && !allowedRoles.includes(user?.currentRole)))) return <Navigate to={"/products"} replace />;

    return <Outlet />;
};

export default Protected;
