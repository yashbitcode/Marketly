import { Button } from "../../../common";
import Star from "../../base-star/Star";

const RatingRow = ({ value, rating, onClickHandler }) => {
    const isActive = rating === value;
    return (
        <Button
            onClick={onClickHandler}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all w-fit bg-transparent
          ${isActive
                    ? "border-dark/50 bg-dark/5 shadow-sm"
                    : "border-transparent hover:border-gray-200"
                }`}
        >
            <span className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                        key={s}
                        size={16}
                        fill={s <= value ? 100 : 0}
                    />
                ))}
            </span>
            <span className="text-xs font-medium text-gray-500">
                {value === 5 ? "Only" : "& up"}
            </span>
        </Button>
    );
};

export default RatingRow;