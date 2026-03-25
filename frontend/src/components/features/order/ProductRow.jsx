const ProductRow = ({ product, quantity }) => {
    const image = product?.images?.[0]?.thumbnailUrl || "https://placehold.co/64x64?text=?";
    const price = product?.price ?? 0;
    const currency = product?.currency || "₹";
    return (
        <div className="flex items-center gap-3 pt-3 pb-3 last:pb-0 border-b border-gray-100 last:border-0">
            <div className="size-14 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                <img src={image} alt={product?.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{product?.name}</p>
                <p className="text-xs text-gray-400">{product?.brandName}</p>
                <p className="text-xs text-gray-400 mt-0.5">Qty: {quantity}</p>
            </div>
            <p className="text-sm font-bold text-gray-800 shrink-0">
                {currency}
                {(price * quantity).toLocaleString("en-IN")}
            </p>
        </div>
    );
};

export default ProductRow;