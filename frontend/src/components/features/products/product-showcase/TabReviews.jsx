import { useNavigate } from "react-router";
import ReviewCard from "../ReviewCard";
import { Button } from "../../../common";
import { memo } from "react";

const TabReviews = ({ reviews, slug }) => {
    const navigate = useNavigate();

    return (
        <div className="w-full">
            <div className="space-y-4 w-full">
                {reviews?.map((review, idx) => (
                    <ReviewCard key={idx} {...review} />
                ))}
            </div>

            <div className="flex justify-center w-full mt-5">
                <Button
                    onClick={() => navigate(`/product/reviews/${slug}`)}
                    className="bg-green mx-auto"
                >
                    See All
                </Button>
            </div>
        </div>
    );
};

export default memo(TabReviews);
