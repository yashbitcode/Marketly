import { Outlet, useLocation } from "react-router";
import { Container } from "../components/common";
import { AUTH_CHOICE } from "../utils/constants";

const AuthLayout = () => {
    const {pathname} = useLocation();
    
    const {leftHead, leftDesc, rightHead, rightDesc} = AUTH_CHOICE[pathname?.split("/")?.[1]];

    return (
        <Container className="font-inter flex p-4 gap-15 max-w-5xl py-10 m-auto justify-between items-center">
            <div className="flex flex-col bg-blue-100 w-full gap-8 max-w-120 text-center p-5 rounded-4xl max-[900px]:hidden">

                <h1 className="text-4xl max-sm:text-4xl text-start font-semibold text-dark">{leftHead}</h1>

                {
                    leftDesc && (
                        <p className="text-gray-600 italic text-start -mt-4">{leftDesc}</p>
                    )
                }

                <div className="w-full -mt-4">
                    <img src="/auth.png" alt="auth" className="w-full max-w-100 mx-auto" />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 w-full  max-[900px]:mt-0 max-[900px]:mx-auto text-dark max-w-120">
                {/* <div className="w-full max-w-40">
                    <img src="/logo3.jpg" alt="logo" className="w-full object-cover" />
                </div> */}
                <div className="text-center">
                    <h1 className="text-3xl font-medium max-sm:text-3xl">{rightHead}</h1>
                    {
                        rightDesc && (
                            <p className="text-gray-600 mt-3 italic">{rightDesc}</p>
                        )
                    }
                </div>
                <Outlet />
            </div>
        </Container>
    );
}

export default AuthLayout;