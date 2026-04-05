import { Homepage, ProductReviews, Products, ProductShowcase, Support, Checkout, PaymentSuccess, PaymentFailed, VendorProducts, VendorOrders, Chat, AllChats, VendorProfile, SuperAdminProducts, SuperAdminProductDetails, SuperAdminVendorApplications, SuperAdminVendorPayouts, SuperAdminSupportTickets, SuperAdminRefundApplications, SuperAdminCategories, OnboardingSuccess } from "./pages";
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
import OrdersPage from "./pages/Order";
import OrderDetailPage from "./pages/OrderDetails";
import ProductCU from "./components/features/vendor/ProductCU";

const App = () => {
    const { loading, user } = useAuth();

    if (loading) return <PageLoader />;
console.log(user)


    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route element={<MainBaseLayout />}>
                        <Route index element={<Homepage />} />
                        <Route path="support" element={<Support />} />
                        <Route path="products" element={<Products />} />
                        <Route path="product/:slug" element={<ProductShowcase />} />
                        <Route path="product/reviews/:slug" element={<ProductReviews />} />
                        <Route path="payment-success/:orderId" element={<PaymentSuccess />} />
                        <Route path="payment-failed/:orderId" element={<PaymentFailed />} />

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

                        <Route element={<Protected />}>
                            <Route path="user" element={<Profile />} />
                            <Route path="checkout" element={<Checkout />} />
                            <Route path="orders" element={<OrdersPage />} />
                            <Route path="orders/:id" element={<OrderDetailPage />} />
                        </Route>

                        <Route element={<Protected allowedRoles={["user", "vendor", "super-admin"]} />}>
                            <Route path="chat/:chatId" element={<Chat />} />
                            <Route path="all-chats" element={<AllChats />} />
                        </Route>

                        <Route path="vendor" element={<Protected allowedRoles={["vendor"]} />}>
                            <Route path="profile" element={<VendorProfile />} />
                            <Route path="products" element={<VendorProducts />} />
                            <Route path="products/add" element={<ProductCU />} />
                            <Route path="products/update/:slug" element={<ProductCU />} />
                            <Route path="orders" element={<VendorOrders />} />
                            <Route path="orders/:id" element={<OrderDetailPage />} />
                            <Route path="onboarding-success" element={<OnboardingSuccess />} />
                        </Route>

                        <Route path="admin" element={<Protected allowedRoles={["super-admin"]} />}>
                            <Route path="products" element={<SuperAdminProducts />} />
                            <Route path="product/:slug" element={<SuperAdminProductDetails />} />
                            <Route path="vendor-applications" element={<SuperAdminVendorApplications />} />
                            <Route path="vendor-payouts" element={<SuperAdminVendorPayouts />} />
                            <Route path="support-tickets" element={<SuperAdminSupportTickets />} />
                            <Route path="refund-applications" element={<SuperAdminRefundApplications />} />
                            <Route path="categories" element={<SuperAdminCategories />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
