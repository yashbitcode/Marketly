import { Link } from "react-router";
import { Button, Container } from ".";
import { BadgeQuestionMark, Handshake, ShoppingBag, User } from "lucide-react";
import { useAuth } from "../../hooks/";

const BaseHeader = () => {
    const { user, loading } = useAuth();
    console.log(user);

    if (loading) return <div>loading...</div>;

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
                            to={"/"}
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

                                <Link to="register">
                                    <Button
                                        variant="secondary"
                                        className="border-gray-300 text-gray-500 hover:text-white hover:bg-orange hover:border-orange"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <div
                                className="bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange  justify-center items-center p-2 rounded-full"
                                to={"/"}
                            >
                                <User strokeWidth={1.8} />
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default BaseHeader;
