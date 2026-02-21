import { LOGIN_CHOICE } from "../../../utils/constants";
import { BaseAuth, Button, Input } from "../../common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidations } from "../../../../../shared/validations/auth.validations";

const Login = ({ choice }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginValidations)
    });

    const { head, desc, sideTag, sideDesc } = LOGIN_CHOICE[choice];

    const onSubmit = (data) => {
        console.log(data);
    }

    return (

        <BaseAuth leftHead={head} leftDesc={desc} rightHead={sideTag} rightDesc={sideDesc}>

            <form className="w-full flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
                <Input label="Email Address" placeholder={"Email Address"} className="px-5 py-3" {...register("email")} error={errors?.email?.message} />
                <Input label="Password" placeholder={"Password"} type="password" className="px-5 py-3" {...register("password")} error={errors?.password?.message} />

                <p className="text-sm text-end -mt-2">Forgot Password?</p>
                <Button className="rounded-[8px] py-3 text-[1.1rem] bg-blue-400" type="submit">Login</Button>
            </form>

        </BaseAuth>


    );
};

export default Login;