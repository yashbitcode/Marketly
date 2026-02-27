import toast, { Toaster } from 'react-hot-toast';
import { Button, Input } from "../../common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidations } from "../../../../../shared/validations/auth.validations";
import { useLocation, useNavigate } from "react-router";
import { AUTH_CHOICE } from "../../../utils/constants";
import useAuth from '../../../hooks/useAuth';

const Login = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const { api: login } = AUTH_CHOICE[pathname.substring(1)];

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginValidations)
    });

    const onSubmit = async (data) => {
        try {
            const res = await login(data);
            console.log(res)

            if (res.data.success) {
                toast.success(res.data.message, {
                    position: "right-top"
                });

                // navigate("/dash", { replace: true });
                setUser(res.data.data);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong", {
                position: "right-top"
            });
        }
    }

    return (
        <form className="w-full flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
            <Toaster />
            <Input label="Email Address" placeholder={"Email Address"} className="px-5 py-3" {...register("email")} error={errors?.email?.message} />
            <Input label="Password" placeholder={"Password"} type="password" className="px-5 py-3" {...register("password")} error={errors?.password?.message} />

            <p className="text-sm text-end -mt-2">Forgot Password?</p>
            <Button className="rounded-[8px] py-3 text-[1.1rem] bg-blue-400" type="submit">Login</Button>
        </form>

    );
};

export default Login;