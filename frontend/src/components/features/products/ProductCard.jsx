import { useNavigate } from "react-router";
import { formatPrice, trimStr } from "../../../utils/helpers";
import { Button } from "../../common";
import RenderStars from "../base-star/RenderStars";

const ProductCard = ({ name, brandName, price, slug, images, avgRating }) => {
    const navigate = useNavigate();
    return (
        <div
            className="p-4 bg-white h-full w-full rounded-[10px] max-w-72 font-inter hover:scale-102 transition-all shadow-base cursor-pointer flex flex-col"
            onClick={() => navigate("/product/" + slug)}
        >
            <div className="w-full max-w-50 mx-auto">
                <img src={images[0].url} alt={name} className="w-full" />
            </div>

            <div className="w-full mt-auto">
                <div className="flex flex-col gap-1.5">
                    <h1 className="truncate">{name}</h1>
                    <h2 className="text-gray-600 italic">{brandName}</h2>
                    <span className="font-medium">₹{formatPrice(price)}</span>

                    <RenderStars avgRating={(+avgRating || 0).toFixed(1)} />
                </div>
                <Button className="mx-auto w-full mt-3 bg-dark/80 text-sm">Buy Now</Button>
            </div>
        </div>
    );
};

export default ProductCard;
