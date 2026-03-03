import { Button, Input } from "../../common";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordValidations } from "../../../../../shared/validations/auth.validations";
import { useParams } from "react-router";
import {AuthApi} from "../../../apis";
import { useVerifyToken } from "../../../hooks";

const ResetPassword = () => {
    const { token } = useParams();
    const { loading, navigate } = useVerifyToken(AuthApi.verifyForgotPasswordToken, token);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordValidations),
    });

    const onSubmit = async (data) => {
        try {
            const res = await AuthApi.resetPassword(token, data);

            if (res.data.success) {
                toast.success(res.data.message, {
                    position: "right-top",
                });
                setTimeout(() => navigate("/login", { replace: true }), 500);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong", {
                position: "right-top",
            });
        }
    };

    if (loading) return <div>loading...</div>;

    return (
        <form className="w-full flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
            <Input
                label="New Password"
                placeholder={"New Password"}
                type="password"
                className="px-5 py-3"
                {...register("newPassword")}
                error={errors?.newPassword?.message}
            />
            <Input
                label="Confirm Password"
                placeholder={"Confirm Password"}
                type="password"
                className="px-5 py-3"
                {...register("confirmPassword")}
                error={errors?.confirmPassword?.message}
            />
            <Button className="rounded-[8px] py-3 mt-2 text-[1.1rem] bg-blue-400" type="submit">
                Reset Password
            </Button>
        </form>
    );
};

export default ResetPassword;
