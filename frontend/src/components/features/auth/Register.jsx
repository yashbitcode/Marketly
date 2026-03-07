import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Input } from "../../common";
import { registerValidations } from "../../../../../shared/validations/auth.validations";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthApi } from "../../../apis";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import Loader from "../../loadings/Loader";

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerValidations),
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await AuthApi.register(data);
            console.log(res);

            if (res?.data?.success) {
                toast.success(res.data.message, {
                    position: "right-top",
                });

                navigate(`/verify-email/${res.data.data.sessionId}`, { replace: true });
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
        <Container className="font-inter flex px-4 gap-15 max-w-5xl py-7 m-auto justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-5 w-full  text-dark max-w-120">
                {/* <div className="w-full max-w-30">
                    <img src="logo3.jpg" alt="logo" className="w-full object-cover" />
                </div> */}
                <div className="text-center">
                    <h1 className="text-4xl font-medium max-sm:text-3xl">Join Marketly today</h1>
                    <p className="text-gray-600 mt-2 italic text-center max-sm:text-sm">
                        Create your account to discover amazing products, enjoy seamless checkout,
                        and shop smarter every day
                    </p>
                </div>
                <form className="w-full flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Username"
                        placeholder={"Username"}
                        className="px-4 py-2"
                        {...register("username")}
                        error={errors?.username?.message}
                    />
                    <Input
                        label="Fullname"
                        placeholder={"Fullname"}
                        className="px-4 py-2"
                        {...register("fullname")}
                        error={errors?.fullname?.message}
                    />
                    <Input
                        label="Email Address"
                        placeholder={"Email Address"}
                        className="px-4 py-2"
                        {...register("email")}
                        error={errors?.email?.message}
                    />
                    <Input
                        label="Phone Number"
                        placeholder={"Phone Number"}
                        className="px-4 py-2"
                        {...register("phoneNumber")}
                        error={errors?.phoneNumber?.message}
                    />
                    <Input
                        label="Password"
                        placeholder={"Password"}
                        type="password"
                        className="px-4 py-2"
                        {...register("password")}
                        error={errors?.password?.message}
                    />
                    <Input
                        label="Confirm Password"
                        placeholder={"Confirm Password"}
                        type="password"
                        className="px-4 py-2"
                        {...register("confirmPassword")}
                        error={errors?.confirmPassword?.message}
                    />

                    <Link to={"/login"} className="text-sm text-end -mt-2">
                        Already Have An Account?
                    </Link>
                    <Button
                        className="flex justify-center items-center gap-4 rounded-[8px] py-2 text-[1.1rem] bg-blue-400"
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
                            "Register"
                        )}
                    </Button>
                </form>
            </div>
        </Container>
    );
};

export default Register;
