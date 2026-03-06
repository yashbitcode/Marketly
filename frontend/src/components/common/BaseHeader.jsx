import { Link, useNavigate } from "react-router";
import { Button, Container } from ".";
import { BadgeQuestionMark, Handshake, ShoppingBag, User } from "lucide-react";
import { useAuth } from "../../hooks/";
import toast from "react-hot-toast";
import { AuthApi } from "../../apis";

const BaseHeader = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await AuthApi.logout();

            if (res?.data?.success) {
                toast.success(res.data.message, {
                    position: "right-top",
                });

                setUser(null);

                navigate("/login", { replace: true });
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong", {
                position: "right-top",
            });
        }
    };

    return (
        <div className="py-4 px-6 shadow-2xs w-full font-inter">
            <Container className="flex justify-between mx-auto">
                <div className="w-full max-w-23">
                    <img src="/logo3.jpg" alt="logo" className="w-full object-cover" />
                </div>

                <div className="w-full max-w-4xl flex gap-3 items-center justify-end">
                    <div className="flex gap-3 items-center ml-5 text-sm font-semibold">
                        <Link
                            className=" bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange justify-center items-center p-2 rounded-full"
                            to={"/"}
                        >
                            <ShoppingBag strokeWidth={1.8} />
                        </Link>
                        <Link
                            className="bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange justify-center items-center p-2 rounded-full"
                            to={"/"}
                        >
                            <Handshake strokeWidth={1.8} />
                        </Link>
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
