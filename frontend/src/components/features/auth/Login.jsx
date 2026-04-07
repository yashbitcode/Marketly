import { Button, Input } from "../../common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidations } from "shared/validations/auth.validations";
import { Link, useLocation, useNavigate } from "react-router";
import { AUTH_CHOICE } from "../../../utils/constants";
import { useAuth } from "../../../hooks";
import Loader from "../../loadings/Loader";
import { useMutation } from "@tanstack/react-query";
import { cn } from "../../../utils/cn";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";

const Login = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const { api: login } = AUTH_CHOICE[pathname.substring(1)];

    const mutation = useMutation({
        mutationFn: (data) => login(data),
        onSuccess: (res) => {
            if (res?.success) {
                SuccessToast(res.message);
                navigate("/products", { replace: true });
                setUser(res);
            }
        },
        onError: (err) => {
            ErrorToast(err?.response?.data?.message || "Something went wrong");
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginValidations),
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex gap-2 p-1 items-center bg-gray-100 rounded-lg">
                <Link
                    to="/login"
                    className={cn(
                        "flex-1 text-center py-2 px-3 text-sm max-sm:text-[0.6rem] font-medium rounded-md transition-all",
                        pathname === "/login"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700",
                    )}
                >
                    User Login
                </Link>
                <Link
                    to="/vendor-login"
                    className={cn(
                        "flex-1 text-center py-2 px-3 text-sm max-sm:text-[0.6rem] font-medium rounded-md transition-all",
                        pathname === "/vendor-login"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700",
                    )}
                >
                    Vendor Login
                </Link>
                <Link
                    to="/admin-login"
                    className={cn(
                        "flex-1 text-center py-2 px-3 text-sm max-sm:text-[0.6rem] font-medium rounded-md transition-all",
                        pathname === "/admin-login"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700",
                    )}
                >
                    Admin Login
                </Link>
            </div>

            <form className="w-full flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Email Address"
                    placeholder={"Email Address"}
                    className="px-5 py-3"
                    {...register("email")}
                    error={errors?.email?.message}
                />
                <Input
                    label="Password"
                    placeholder={"Password"}
                    type="password"
                    className="px-5 py-3"
                    {...register("password")}
                    error={errors?.password?.message}
                />

                <Link to={"/forgot-password"} className="text-sm text-end -mt-2">
                    Forgot Password?
                </Link>
                <Button
                    className="rounded-base flex justify-center items-center gap-4 py-3 text-[1.1rem] bg-blue-400"
                    type="submit"
                >
                    {mutation.isPending ? (
                        <>
                            <div className="w-fit">
                                <Loader />
                            </div>
                            Loading...
                        </>
                    ) : (
                        "Login"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default Login;
