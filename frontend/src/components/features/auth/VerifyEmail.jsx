import { useParams } from "react-router";
import { Button, Container, Input } from "../../common";
import useVerifyToken from "../../../hooks/useVerifyToken";
import AuthApi from "../../../apis/authApi";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { preventKeys, preventNumInp } from "../../../utils/constants";

const VerifyEmail = () => {
    const { sessionId } = useParams();
    const { loading, navigate } = useVerifyToken(AuthApi.verifyEmailSession, sessionId);
    const [currentInp, setCurrentInp] = useState(0);
    const [tokenError, setTokenError] = useState(null);

    const inputRefs = useRef(Array.from({ length: 6 }));

    const onSubmit = async (e) => {
        e.preventDefault();

        const token = inputRefs.current?.map((el) => el.value).join("");

        if (token.length !== 6) {
            setTokenError("Fill The Token")
            return;
        }

        try {
            const res = await AuthApi.verifyEmailToken(sessionId, token);

            if (res.data.success) {
                toast.success(res.data.message, {
                    position: "right-top"
                });
                setTimeout(() => navigate("/login", { replace: true }), 500);
            } else {
                toast.error(res.data.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong", {
                position: "right-top"
            });
        }
    }

    const getPosition = () => {
        let prev = -1;
        let next = -1;

        inputRefs.current?.forEach((el, idx) => {
            const val = el.value;

            if (idx !== currentInp && !val) {
                if (idx < currentInp && prev === -1) prev = idx;
                else if (idx > currentInp && next === -1) next = idx;
            }
        });

        return { prev, next };
    }

    const handleKeyPress = (e) => {
        const key = e.key;
        const val = e.target.value;

        if (preventNumInp.includes(key) || (val && !preventKeys.includes(key))) {
            e.preventDefault();
            return;
        }

        if (key === "Backspace" && !val && currentInp) {
            setCurrentInp(currentInp - 1);
            inputRefs.current?.[currentInp - 1]?.focus();
        }
    }

    const handleChange = (e) => {
        setTokenError(null);
        const val = e.target.value;

        const { prev, next } = getPosition();
        const pos = next !== -1 ? next : prev;

        if (val) {
            if (pos !== -1) {
                setCurrentInp(pos);
                inputRefs.current?.[pos]?.focus();
            }
        }
    }


    if (loading) return <div>loading...</div>

    return (
        <Container className="font-inter flex px-4 gap-15 max-w-5xl py-7 justify-center items-center h-screen m-auto">
            <div className="flex flex-col items-center justify-center gap-5 w-full  text-dark max-w-120">
                <div className="w-full max-w-30">
                    <img src="/logo3.jpg" alt="logo" className="w-full object-cover" />
                </div>
                <div className="text-center">
                    <h1 className="text-4xl font-medium max-sm:text-3xl">
                        Verify your email
                    </h1>
                    <p className="text-gray-600 mt-2 italic text-center max-sm:text-sm">
                        Enter the one-time password sent to your email to complete your registration securely.
                    </p>
                </div>
                <form className="w-full flex flex-col gap-1" onSubmit={onSubmit}>

                    <div className="flex max-w-3xl gap-4 mx-auto"   >{
                        Array.from({ length: 6 }).map((_, idx) => (
                            <Input key={idx} ref={(el) => (inputRefs.current[idx] = el)} className="w-15 max-sm:w-10 flex justify-center items-center no-spinner text-center" onFocus={() => setCurrentInp(idx)} type="number" onChange={handleChange} onKeyDown={handleKeyPress} />
                        ))
                    }
                    </div>
                    <Button type="submit" className="w-fit mx-auto mt-4">Submit</Button>
                </form>

                <span className="text-red-500 text-[1.1rem] italic -mt-1">{tokenError}</span>

            </div>
        </Container>
    );
};

export default VerifyEmail;