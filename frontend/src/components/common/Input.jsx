import { useId } from "react";
import { cn } from "../../utils/cn";

const Input = ({ type = "text", className = "", name = "", defaultId, error, label, ref, ...props }) => {
    const id = useId();

    const variants = {
        primary: "border-gray-200 bg-base-white focus:border-gray-300",
        error: "border-red-200 bg-red-100/40 focus:border-red-300"
    };

    return (
        <div className="w-full flex flex-col gap-1.5">
            {
                label && (
                    <label htmlFor={defaultId || id}>{label}</label>
                )
            }
            <input type={type} ref={ref} id={defaultId || id} name={name} className={cn("border-2 outline-0 px-4 rounded-base py-2 text-black/80", !error ?  variants.primary : variants.error, className)} {...props} />
            {
                error && (
                    <span className="text-red-500 text-[0.8rem] -mt-1">{error}</span>
                )
            }
        </div>
    )
}

export default Input;