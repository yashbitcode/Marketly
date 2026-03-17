import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Container } from ".";
import {
    BadgeQuestionMark,
    Bell,
    Handshake,
    ShoppingBag,
    User,
    Menu,
    X,
    ShoppingCart,
} from "lucide-react";
import { useAuth } from "../../hooks/";
import { AuthApi } from "../../apis";
import { ErrorToast, SuccessToast } from "../../utils/toasts";
import { useMutation } from "@tanstack/react-query";
import NotificationBar from "../features/notification/NotificationBar";

const BaseHeader = () => {
    const { user, setUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: AuthApi.logout,
        onSuccess: (res) => {
            SuccessToast(res.message);
            setUser(null);
            navigate("/login", { replace: true });
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Something went wrong"),
    });
    const navigate = useNavigate();

    const handleLogout = () => {
        mutation.mutate();
    };

    const isUser = user?.role === "user" || (user && !user.role);
    const isVendor = user?.role === "vendor";
    const isAdmin = user?.role === "admin";

    return (
        <div className="py-4 px-6 shadow-2xs w-full font-inter">
            <Container className="flex justify-between mx-auto">
                <Link to="/" className="w-full max-w-23 cursor-pointer">
                    <img src="/logo3.jpg" alt="logo" className="w-full object-cover" />
                </Link>

                <div className="w-full max-w-4xl flex gap-3 items-center justify-end">
                    <div className="flex gap-3 items-center ml-5 text-sm font-semibold">
                        {user && (isUser || isVendor) && <NotificationBar />}

                        <div className="hidden min-[750px]:flex gap-3 items-center">
                            {(!user || isUser) && (
                                <>
                                    <Link
                                        className="bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange  justify-center items-center p-2 rounded-full"
                                        to={"/support"}
                                    >
                                        <BadgeQuestionMark strokeWidth={1.8} />
                                    </Link>
                                    <Link
                                        className="bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange  justify-center items-center p-2 rounded-full"
                                        to={"/checkout"}
                                    >
                                        <ShoppingCart strokeWidth={1.8} />
                                    </Link>
                                </>
                            )}

                            {!user && (
                                <>
                                    <Link to="/login">
                                        <Button
                                            variant="secondary"
                                            className="border-gray-300 text-gray-500 hover:text-white hover:bg-orange hover:border-orange"
                                        >
                                            Login
                                        </Button>
                                    </Link>

                                    <Link to="/register">
                                        <Button
                                            variant="secondary"
                                            className="border-gray-300 text-gray-500 hover:text-white hover:bg-orange hover:border-orange"
                                        >
                                            Sign Up
                                        </Button>
                                    </Link>
                                </>
                            )}

                            {isUser && (
                                <>
                                    <Link
                                        className="bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange  justify-center items-center p-2 rounded-full"
                                        to={"/orders"}
                                    >
                                        <ShoppingBag strokeWidth={1.8} />
                                    </Link>
                                    <Link
                                        className="bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange  justify-center items-center p-2 rounded-full"
                                        to={"/user"}
                                    >
                                        <User strokeWidth={1.8} />
                                    </Link>
                                    <Button
                                        onClick={handleLogout}
                                        variant="secondary"
                                        className="border-gray-300 text-gray-500 hover:text-white hover:bg-orange hover:border-orange"
                                    >
                                        Logout
                                    </Button>
                                </>
                            )}

                            {isVendor && (
                                <>
                                    <Link
                                        className="text-gray-500 hover:text-orange transition-all font-medium"
                                        to={"/vendor/products"}
                                    >
                                        All Products
                                    </Link>
                                    <Link
                                        className="text-gray-500 hover:text-orange transition-all font-medium"
                                        to={"/vendor/orders"}
                                    >
                                        All Orders
                                    </Link>
                                    <Button
                                        onClick={handleLogout}
                                        variant="secondary"
                                        className="border-gray-300 text-gray-500 hover:text-white hover:bg-orange hover:border-orange"
                                    >
                                        Logout
                                    </Button>
                                </>
                            )}

                            {isAdmin && (
                                <>
                                    <Link
                                        className="text-gray-500 hover:text-orange transition-all font-medium"
                                        to={"/admin/dashboard"}
                                    >
                                        Admin Panel
                                    </Link>
                                    <Link
                                        className="text-gray-500 hover:text-orange transition-all font-medium"
                                        to={"/admin/users"}
                                    >
                                        Users
                                    </Link>
                                    <Button
                                        onClick={handleLogout}
                                        variant="secondary"
                                        className="border-gray-300 text-gray-500 hover:text-white hover:bg-orange hover:border-orange"
                                    >
                                        Logout
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Hamburger Icon */}
                        <div className="min-[750px]:hidden flex items-center">
                            <Button
                                onClick={() => setIsSidebarOpen(true)}
                                className="text-gray-500 hover:text-white hover:bg-orange hover:border-orange transition-all rounded-full flex justify-center items-center p-0 bg-transparent"
                            >
                                <Menu strokeWidth={2} size={22} />
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-100 bg-black/30 backdrop-blur-[2px] min-[750px]:hidden font-inter transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <div
                        className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl p-6 flex flex-col gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center bg-white">
                            <span className="font-bold text-lg text-gray-900">Menu</span>
                            <Button
                                onClick={() => setIsSidebarOpen(false)}
                                className="text-gray-400 hover:text-orange p-0 bg-transparent transition-colors"
                            >
                                <X size={24} strokeWidth={2} />
                            </Button>
                        </div>

                        <div className="flex flex-col gap-2 text-sm font-semibold">
                            {(!user || isUser) && (
                                <>
                                    <Link
                                        className="flex gap-3 text-gray-600 hover:text-orange transition-all items-center p-3 rounded-xl hover:bg-orange/10"
                                        to={"/checkout"}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <ShoppingCart size={20} strokeWidth={1.8} />
                                        <span>Cart</span>
                                    </Link>

                                    <Link
                                        className="flex gap-3 text-gray-600 hover:text-orange transition-all items-center p-3 rounded-xl hover:bg-orange/10"
                                        to={"/support"}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <BadgeQuestionMark size={20} strokeWidth={1.8} />
                                        <span>Support</span>
                                    </Link>
                                </>
                            )}

                            {!user && (
                                <div className="flex flex-col gap-3 mt-4">
                                    <Link to="/login" onClick={() => setIsSidebarOpen(false)}>
                                        <Button
                                            variant="secondary"
                                            className="w-full flex border-gray-300 text-gray-500 hover:text-white hover:bg-orange hover:border-orange justify-center"
                                        >
                                            Login
                                        </Button>
                                    </Link>

                                    <Link to="/register" onClick={() => setIsSidebarOpen(false)}>
                                        <Button
                                            variant="secondary"
                                            className="w-full flex border-gray-300 text-gray-500 hover:text-white hover:bg-orange hover:border-orange justify-center"
                                        >
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {isUser && (
                                <>
                                    <Link
                                        className="flex gap-3 text-gray-600 hover:text-orange transition-all items-center p-3 rounded-xl hover:bg-orange/10"
                                        to={"/orders"}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <ShoppingBag size={20} strokeWidth={1.8} />
                                        <span>Orders</span>
                                    </Link>

                                    <Link
                                        className="flex gap-3 text-gray-600 hover:text-orange transition-all items-center p-3 rounded-xl hover:bg-orange/10"
                                        to={"/user"}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <User size={20} strokeWidth={1.8} />
                                        <span>Profile</span>
                                    </Link>

                                    <div className="mt-4">
                                        <Button
                                            onClick={() => {
                                                handleLogout();
                                                setIsSidebarOpen(false);
                                            }}
                                            variant="secondary"
                                            className="w-full flex border-gray-300 text-gray-500 hover:text-white hover:bg-orange hover:border-orange justify-center"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </>
                            )}

                            {isVendor && (
                                <>
                                    <Link
                                        className="flex gap-3 text-gray-600 hover:text-orange transition-all items-center p-3 rounded-xl hover:bg-orange/10"
                                        to={"/vendor/products"}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <span>All Products</span>
                                    </Link>

                                    <Link
                                        className="flex gap-3 text-gray-600 hover:text-orange transition-all items-center p-3 rounded-xl hover:bg-orange/10"
                                        to={"/vendor/orders"}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <span>All Orders</span>
                                    </Link>

                                    <div className="mt-4">
                                        <Button
                                            onClick={() => {
                                                handleLogout();
                                                setIsSidebarOpen(false);
                                            }}
                                            variant="secondary"
                                            className="w-full flex border-gray-300 text-gray-500 hover:text-white hover:bg-orange hover:border-orange justify-center"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </>
                            )}

                            {isAdmin && (
                                <>
                                    <Link
                                        className="flex gap-3 text-gray-600 hover:text-orange transition-all items-center p-3 rounded-xl hover:bg-orange/10"
                                        to={"/admin/dashboard"}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <span>Admin Panel</span>
                                    </Link>

                                    <Link
                                        className="flex gap-3 text-gray-600 hover:text-orange transition-all items-center p-3 rounded-xl hover:bg-orange/10"
                                        to={"/admin/users"}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <span>Manage Users</span>
                                    </Link>

                                    <div className="mt-4">
                                        <Button
                                            onClick={() => {
                                                handleLogout();
                                                setIsSidebarOpen(false);
                                            }}
                                            variant="secondary"
                                            className="w-full flex border-gray-300 text-gray-500 hover:text-white hover:bg-orange hover:border-orange justify-center"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseHeader;
