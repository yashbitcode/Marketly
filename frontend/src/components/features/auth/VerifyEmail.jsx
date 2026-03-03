import { useParams } from "react-router";
import { Button, Container, Input } from "../../common";
import { useVerifyToken } from "../../../hooks";
import { AuthApi } from "../../../apis";
import toast from "react-hot-toast";
import { TOKEN_LENGTH } from "../../../utils/constants";
import { useTokenInput } from "../../../hooks";

const VerifyEmail = () => {
    const { sessionId } = useParams();
    const { loading, navigate } = useVerifyToken(AuthApi.verifyEmailSession, sessionId);
    const { setCurrentInp, tokenError, setTokenError, handleKeyPress, inputRefs, handleChange } =
        useTokenInput();

    const onSubmit = async (e) => {
        e.preventDefault();

        const token = inputRefs.current?.map((el) => el.value).join("");

        if (token.length !== TOKEN_LENGTH) {
            setTokenError("Fill The Token");
            return;
        }

        try {
            const res = await AuthApi.verifyEmailToken(sessionId, token);

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
        <Container className="font-inter flex px-4 gap-15 max-w-5xl py-7 justify-center items-center h-screen m-auto">
            <div className="flex flex-col items-center justify-center gap-5 w-full  text-dark max-w-120">
                <div className="w-full max-w-30">
                    <img src="/logo3.jpg" alt="logo" className="w-full object-cover" />
                </div>
                <div className="text-center">
                    <h1 className="text-4xl font-medium max-sm:text-3xl">Verify your email</h1>
                    <p className="text-gray-600 mt-2 italic text-center max-sm:text-sm">
                        Enter the one-time password sent to your email to complete your registration
                        securely.
                    </p>
                </div>
                <form className="w-full flex flex-col gap-1" onSubmit={onSubmit}>
                    <div className="flex max-w-3xl gap-4 mx-auto">
                        {Array.from({ length: TOKEN_LENGTH }).map((_, idx) => (
                            <Input
                                key={idx}
                                ref={(el) => (inputRefs.current[idx] = el)}
                                className="w-15 max-sm:w-10 flex justify-center items-center no-spinner text-center"
                                onFocus={() => setCurrentInp(idx)}
                                type="number"
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                onPaste={(e) => {
                                    const pasteData = e.clipboardData.getData("text");

                                    if (!/^\d+$/.test(pasteData)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        ))}
                    </div>
                    <Button type="submit" className="w-fit mx-auto mt-4">
                        Submit
                    </Button>
                </form>

                <span className="text-red-500 text-[1.1rem] italic -mt-1">{tokenError}</span>
            </div>
        </Container>
    );
};

export default VerifyEmail;
