import { BaseAuth, Button, Input } from "../../common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordLinkValidations } from "../../../../../shared/validations/auth.validations";

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotPasswordLinkValidations)
    });

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <BaseAuth leftHead={"Forgot your password?"} leftDesc={"No worries. Enter your email and we’ll help you get back into your account"} rightDesc={"Get Forgot Password Link On Your Email..."}>
            <form className="w-full flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
                <Input label="Email Address" placeholder={"Email Address"} className="px-5 py-3" {...register("email")} error={errors?.email?.message} />
                <p className="text-sm text-end -mt-2">Back To Login?</p>
                <Button className="rounded-[8px] py-3 text-[1.1rem] bg-blue-400" type="submit">Forgot Password</Button>
            </form>
        </BaseAuth>
    );
};

export default ForgotPassword;