import RenderStars from "../base-star/RenderStars";

const ReviewCard = ({ heading, createdAt, ratings, comment }) => {
    return (
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-base">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="font-bold text-sm text-slate-900">{heading}</p>
                    <p className="text-xs text-slate-400 mt-1.5">
                        {new Date(createdAt).toLocaleDateString()}
                    </p>
                </div>
                <RenderStars avgRating={ratings} size={10} />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{comment}</p>
        </div>
    );
};

export default ReviewCard;
