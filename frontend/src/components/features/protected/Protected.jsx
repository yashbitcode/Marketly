import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../../hooks";
import Loader from "../../loadings/Loader";

const Protected = ({ authenticate = true }) => {
    const { user, loading } = useAuth();
    console.log(user);

    if (loading) return <Loader />;

    if (user && !authenticate) return <Navigate to={"/products"} replace />;
    if (!user && authenticate) return <Navigate to={"/login"} replace />;

    return <Outlet />;
};

export default Protected;
