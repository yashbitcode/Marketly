import { Button, Input } from "../../common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordLinkValidations } from "../../../../../shared/validations/auth.validations";
import { AuthApi } from "../../../apis";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";

const ForgotPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordLinkValidations),
    });

    const mutation = useMutation({
        mutationFn: AuthApi.forgotPasswordLink,
        onSuccess: (res) => {
            SuccessToast(res.message);
        },
        onError: (err) => {
            ErrorToast(err?.response?.data?.message || "Something went wrong");
        },
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
            <Link to={"/login"} className="text-sm text-end -mt-2">
                Back To Login?
            </Link>
            <Button
                className="rounded-[8px] py-3 text-[1.1rem] bg-blue-400"
                type="submit"
                disabled={mutation.isPending}
            >
                {mutation.isPending ? "Sending..." : "Forgot Password"}
            </Button>
        </form>
    );
};

export default ForgotPassword;
