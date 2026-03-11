import toast from "react-hot-toast";
import { Button, Input } from "../../common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidations } from "../../../../../shared/validations/auth.validations";
import { Link, useLocation, useNavigate } from "react-router";
import { AUTH_CHOICE } from "../../../utils/constants";
import { useAuth } from "../../../hooks";
import { useState } from "react";
import Loader from "../../loadings/Loader";
import { useMutation } from "@tanstack/react-query";
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
                className="rounded-[8px] flex justify-center items-center gap-4 py-3 text-[1.1rem] bg-blue-400"
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
    );
};

export default Login;
