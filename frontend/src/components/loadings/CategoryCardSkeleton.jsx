const CategoryCardSkeleton = () => {
    return (
        <div className="w-full max-w-60 h-28 rounded-2xl bg-white p-6 shadow-base animate-pulse">
            <div className="flex flex-col justify-between h-full">
                <div className="h-6 w-32 bg-gray-200 rounded-md" />
                <div className="flex items-center gap-2">
                    <div className="h-4 w-20 bg-gray-200 rounded-md" />
                    <div className="h-4 w-4 bg-gray-200 rounded-sm" />
                </div>
            </div>
        </div>
    );
};

export default CategoryCardSkeleton;
