import { useEffect } from "react";
import { ErrorToast } from "../../utils/toasts";

const Error = ({ error }) => {
    useEffect(() => {
        if(error) ErrorToast(error);
    }, [error])

    return (
        <div className="px-2 py-1 shadow-base h-full rounded-[7px] text-2xl my-10 w-fit mx-auto -rotate-10">
            {error}
        </div>
    );
};

export default Error;
