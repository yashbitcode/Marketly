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

const Login = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const { api: login } = AUTH_CHOICE[pathname.substring(1)];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginValidations),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await login(data);
            console.log(res);

            if (res.data.success) {
                toast.success(res.data.message, {
                    position: "right-top",
                });

                navigate("/products", { replace: true });
                setUser(res.data.data);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong", {
                position: "right-top",
            });
        } finally {
            setLoading(false);
        }
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
                {loading ? (
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
