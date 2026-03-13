import { Link, useNavigate } from "react-router";
import { Button, Container } from ".";
import { BadgeQuestionMark, Bell, Handshake, ShoppingBag, User } from "lucide-react";
import { useAuth } from "../../hooks/";
import { AuthApi } from "../../apis";
import { ErrorToast, SuccessToast } from "../../utils/toasts";
import { useMutation } from "@tanstack/react-query";
import NotificationBar from "../features/notification/NotificationBar";

const BaseHeader = () => {
    const { user, setUser } = useAuth();
    console.log(user);

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

    return (
        <div className="py-4 px-6 shadow-2xs w-full font-inter">
            <Container className="flex justify-between mx-auto">
                <Link to="/" className="w-full max-w-23 cursor-pointer">
                    <img src="/logo3.jpg" alt="logo" className="w-full object-cover" />
                </Link>

                <div className="w-full max-w-4xl flex gap-3 items-center justify-end">
                    <div className="flex gap-3 items-center ml-5 text-sm font-semibold">
                        <Link
                            className=" bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange justify-center items-center p-2 rounded-full"
                            to={"/"}
                        >
                            <ShoppingBag strokeWidth={1.8} />
                        </Link>
                        {user && (
                            <NotificationBar />
                        )}
                        <Link
                            className="bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange  justify-center items-center p-2 rounded-full"
                            to={"/support"}
                        >
                            <BadgeQuestionMark strokeWidth={1.8} />
                        </Link>

                        {!user ? (
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
                        ) : (
                            <>
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
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default BaseHeader;
