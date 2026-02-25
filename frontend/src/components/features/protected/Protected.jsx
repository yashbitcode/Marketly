import { Navigate } from "react-router";
import useAuth from "../../../hooks/useAuth";

const Protected = ({authenticate = true, children}) => {
    const {user, loading} = useAuth();

    if(loading) return <div>Loading...</div>;

    if(user && !authenticate) return <Navigate to={"/"} replace />
    if(!user && authenticate) return <Navigate to={"/login"} replace />

    return children;
}

export default Protected;