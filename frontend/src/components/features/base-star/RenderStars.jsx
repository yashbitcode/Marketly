import Star from "./Star";

const RenderStars = ({ avgRating }) => {
    let tempRating = avgRating;

    return (
        <div className="flex gap-1 mt-1">
            {
                Array.from({ length: 5 }).map((_, idx) => {
                    let fill = 100;

                    if (tempRating >= 1) tempRating--;
                    else {
                        fill = (tempRating * 100);
                        tempRating = 0
                    }

                    return <Star key={idx} fill={fill} />
                })
            }

            <span className="text-gray-500">({avgRating})</span>
        </div>
    )
}

export default RenderStars;