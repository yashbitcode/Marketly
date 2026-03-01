import { useRef, useState } from "react";
import { preventKeys, preventNumInp, TOKEN_LENGTH } from "../utils/constants";

const useTokenInput = () => {
    const [currentInp, setCurrentInp] = useState(0);
    const [tokenError, setTokenError] = useState(null);
    const inputRefs = useRef(Array.from({ length: TOKEN_LENGTH }));

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
    };

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
    };

    const handleChange = (e) => {
        setTokenError(null);
        const val = e.target.value;

        const { prev, next } = getPosition();
        const pos = next !== -1 ? next : prev;

        if (val) {
            if (val.length > 1) {
                let cnt = 0;

                while (cnt < val.length && (currentInp + cnt) < TOKEN_LENGTH) {
                    const inpVal = inputRefs.current[currentInp + cnt].value;

                    if (inpVal) inputRefs.current[currentInp + cnt].value = inpVal[0];
                    else inputRefs.current[currentInp + cnt].value = val[cnt];

                    if ((currentInp + cnt) < (TOKEN_LENGTH - 1)) cnt++;
                    else break
                }

                inputRefs.current[currentInp + cnt].focus();
                setCurrentInp(currentInp + cnt)
            } else if (pos !== -1) {
                setCurrentInp(pos);
                inputRefs.current?.[pos]?.focus();
            }
        }
    };

    return {setCurrentInp, tokenError,inputRefs, setTokenError, handleKeyPress, handleChange}
}

export default useTokenInput;