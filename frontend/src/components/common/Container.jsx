import { twMerge } from "tailwind-merge";

const Container = ({ className = "", children }) => {
    return (
        <div className={twMerge("w-full max-w-7xl", className)}>
            {children}
        </div>
    );
};

export default Container;