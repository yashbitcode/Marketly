import { Homepage, Products, Support } from "./pages";
import AuthLayout from "./layouts/AuthLayout";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./components/features/auth/Login";
import ForgotPassword from "./components/features/auth/ForgotPassword";
import ResetPassword from "./components/features/auth/ResetPassword";
import Register from "./components/features/auth/Register";
import Protected from "./components/features/protected/Protected";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./components/features/auth/VerifyEmail";
import MainBaseLayout from "./layouts/MainBaseLayout";
import { useAuth } from "./hooks";
import PageLoader from "./components/loadings/PageLoader";
import Profile from "./components/features/user/Profile";

const App = () => {
    const { loading } = useAuth();

    if (loading) return <PageLoader />;

    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route element={<MainBaseLayout />}>
                        <Route index element={<Profile />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/products" element={<Products />} />
                        <Route element={<Protected authenticate={false} />}>
                            <Route element={<AuthLayout />}>
                                <Route path="login" element={<Login />} />
                                <Route path="vendor-login" element={<Login />} />
                                <Route path="admin-login" element={<Login />} />
                                <Route path="forgot-password" element={<ForgotPassword />} />
                                <Route path="reset-password/:token" element={<ResetPassword />} />
                            </Route>
                            <Route path="register" element={<Register />} />
                            <Route path="verify-email/:sessionId" element={<VerifyEmail />} />
                        </Route>

                        {/* <Route path="dash" element={<Protected />}>
                            <Route index element={<ProductsFilter />} />
                        </Route> */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
