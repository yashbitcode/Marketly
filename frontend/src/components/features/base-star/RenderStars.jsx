import Star from "./Star";

const RenderStars = ({ avgRating, starSize = 15 }) => {
    let tempRating = avgRating;

    return (
        <div className="flex gap-1 mt-1 items-center">
            {Array.from({ length: 5 }).map((_, idx) => {
                let fill = 100;

                if (tempRating >= 1) tempRating--;
                else {
                    fill = tempRating * 100;
                    tempRating = 0;
                }

                return <Star key={idx} size={starSize} fill={fill} />;
            })}

            {
                avgRating && <span className="text-gray-500">({avgRating})</span>
            }
        </div>
    );
};

export default RenderStars;
