import { cn } from "../../utils/cn";

const Button = ({ className = "", type = "button", variant = "primary", children, ...props }) => {
    const variants = {
        primary: "bg-dark text-white",
        secondary: "border-2 border-dark text-dark bg-transparent"
    }

    return (
        <button className={cn("rounded-full px-4 py-1 cursor-pointer transition-all", variants[variant], className)} type={type} {...props}>{children}</button>
    );
};

export default Button;