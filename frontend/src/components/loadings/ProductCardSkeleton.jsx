const ProductCardSkeleton = () => {
    return (
        <div className="p-4 bg-white rounded-base w-65 font-inter shadow-base">
            {/* Image */}
            <div className="w-full max-w-60 mx-auto">
                <div className="w-full h-50 bg-gray-200 rounded-md animate-pulse" />
            </div>

            {/* Text Section */}
            <div className="flex flex-col gap-2 mt-4">
                {/* Product Name */}
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />

                {/* Brand Name */}
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />

                {/* Price */}
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />

                {/* Rating */}
                <div className="flex gap-1 mt-1">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>

            {/* Button */}
            <div className="h-9 bg-gray-300 rounded-full w-full mt-4 animate-pulse" />
        </div>
    );
};

export default ProductCardSkeleton;
