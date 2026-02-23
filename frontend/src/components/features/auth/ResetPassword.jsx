import { Button, Input } from "../../common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordValidations } from "../../../../../shared/validations/auth.validations";

const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(resetPasswordValidations)
    });

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
            <form className="w-full flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
                <Input label="New Password" placeholder={"New Password"} type="password" className="px-5 py-3" {...register("newPassword")} error={errors?.newPassword?.message} />
                <Input label="Confirm Password" placeholder={"Confirm Password"} type="password" className="px-5 py-3" {...register("confirmPassword")} error={errors?.confirmPassword?.message} />
                <Button className="rounded-[8px] py-3 mt-2 text-[1.1rem] bg-blue-400" type="submit">Reset Password</Button>
            </form>
    );
};

export default ResetPassword;