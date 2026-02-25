import { Homepage } from "./pages";
import AuthLayout from "./layouts/AuthLayout";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./components/features/auth/Login";
import ForgotPassword from "./components/features/auth/ForgotPassword";
import ResetPassword from "./components/features/auth/ResetPassword";
import Register from "./components/features/auth/Register";
import Protected from "./components/features/protected/Protected";
import AuthProvider from "./context/context-providers/AuthProvider";

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Homepage />} />
                    <Route element={<Protected authenticate={false} />}>
                        <Route element={<AuthLayout />}>
                            <Route path="login" element={<Login />} />
                            <Route path="vendor-login" element={<Login />} />
                            <Route path="admin-login" element={<Login />} />
                            <Route path="forgot-password" element={<ForgotPassword />} />
                            <Route path="reset-password" element={<ResetPassword />} />
                        </Route>
                        <Route path="register" element={<Register />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App;