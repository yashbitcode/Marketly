import { LOGIN_CHOICE } from "../../../utils/constants";
import { Button, Container, Input } from "../../common";

const Login = ({choice}) => {
    const {head, desc, sideTag, sideDesc} = LOGIN_CHOICE[choice];

    return (
        <Container className="font-inter flex p-4 gap-15 max-w-5xl h-screen m-auto justify-between items-center">
            <div className="flex flex-col bg-blue-100 w-full gap-8 max-w-120 text-center p-5 rounded-4xl">
                <h1 className="text-4xl max-sm:text-4xl text-start font-semibold text-dark">{head}</h1>
                <p className="text-gray-600 italic text-start">{desc}</p>

                <div className="w-full -mt-4">
                    <img src="auth.png" alt="auth" className="w-full max-w-100 mx-auto" />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-5 w-full -mt-30 text-dark">
                <div className="w-full max-w-40">
                    <img src="logo3.jpg" alt="logo" className="w-full object-cover" />
                </div>
                <div className="text-center">
                    <h1 className="text-4xl font-medium">{sideTag}</h1>
                    <p className="text-gray-600 mt-3 italic text-start">{sideDesc}</p>
                </div>
                <form className="w-full flex gap-4 flex-col">
                    <Input label="Email Address" placeholder={"Email Address"} className="px-5 py-3" />
                    <Input label="Password" placeholder={"Password"} type="password" className="px-5 py-3" />
                    
                    <p className="text-sm text-end -mt-2">Forgot Password?</p>
                    <Button className="rounded-[8px] py-3 text-[1.1rem] bg-blue-400" type="submit">Login</Button>
                </form>
            </div>
        </Container>
    )
}

export default Login;