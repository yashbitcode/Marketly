import { Button, Input } from "../../common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordLinkValidations } from "../../../../../shared/validations/auth.validations";
import { AuthApi } from "../../../apis";
import toast from "react-hot-toast";
import { Link } from "react-router";

const ForgotPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordLinkValidations),
    });

    const onSubmit = async (data) => {
        try {
            const res = await AuthApi.forgotPasswordLink(data);

            if (res.data.success) {
                toast.success(res.data.message, {
                    position: "right-top",
                });
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong", {
                position: "right-top",
            });
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
            <Link to={"/login"} className="text-sm text-end -mt-2">
                Back To Login?
            </Link>
            <Button className="rounded-[8px] py-3 text-[1.1rem] bg-blue-400" type="submit">
                Forgot Password
            </Button>
        </form>
    );
};

export default ForgotPassword;
