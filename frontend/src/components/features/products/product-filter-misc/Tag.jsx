import { Button } from "../../../common";

const Tag = ({ label, active, onClick }) => (
    <Button
        onClick={onClick}
        className={`px-3 py-1 rounded-full text-xs font-medium border-2 transition-all whitespace-nowrap
        ${
            active
                ? "bg-dark text-white border-dark"
                : "border-gray-200 text-gray-600 hover:border-gray-400 bg-white"
        }`}
    >
        {label}
    </Button>
);

export default Tag;
