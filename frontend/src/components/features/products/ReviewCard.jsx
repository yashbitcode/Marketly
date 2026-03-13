import { getFormatedStr } from "../../../utils/helpers";
import RenderStars from "../base-star/RenderStars";

const ReviewCard = ({ heading, createdAt, ratings, comment, user }) => {
    return (
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-base">
            <div className="flex items-start justify-between mb-3 max-sm:flex-col">
                <div>
                    <p className="font-bold text-sm text-slate-900">{getFormatedStr(heading)}</p>
                    <div className={"flex gap-2 my-1.5 items-center"}>
                        <p className="text-xs text-slate-500 order-2">
                            {new Date(createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-[0.8rem] text-slate-500 underline">
                            Review By: {getFormatedStr(user?.fullname)}
                        </p>
                    </div>
                </div>
                <RenderStars avgRating={ratings} size={10} />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{comment}</p>
        </div>
    );
};

export default ReviewCard;
