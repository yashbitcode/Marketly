import { Button, Input } from "../../common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordValidations } from "../../../../../shared/validations/auth.validations";
import { useParams } from "react-router";
import { AuthApi } from "../../../apis";
import { useVerifyToken } from "../../../hooks";
import { useMutation } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";

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

    const mutation = useMutation({
        mutationFn: (data) => AuthApi.resetPassword(token, data),
        onSuccess: (res) => {
            if (res.success) {
                SuccessToast(res.message);
                setTimeout(() => navigate("/login", { replace: true }), 500);
            } else {
                ErrorToast(res.message);
            }
        },
        onError: (err) => {
            ErrorToast(err?.response?.data?.message || "Something went wrong");
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
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
            <Button
                className="rounded-[8px] py-3 mt-2 text-[1.1rem] bg-blue-400"
                type="submit"
                disabled={mutation.isPending}
            >
                {mutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
        </form>
    );
};

export default ResetPassword;
