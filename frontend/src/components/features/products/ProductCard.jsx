import { trimStr } from "../../../utils/helpers";
import RenderStars from "../base-star/RenderStars";

const ProductCard = ({ title, storeName, price, productImg, avgRating }) => {
    return (
        <div className="p-4 bg-white w-full rounded-base max-w-70 font-inter hover:scale-102 transition-all shadow-base">
            <div className="w-full max-w-50 mx-auto">
                <img src={productImg} alt={title} className="w-full" />
            </div>

            <div className="flex flex-col gap-1.5">
                <h1>{trimStr(title, 25)}</h1>
                <h2 className="text-gray-600">{storeName}</h2>
                <span className="text-[1.15rem] font-medium">₹{price}</span>

                <RenderStars avgRating={avgRating} />
            </div>
        </div>
    )
};

/* 
    avg-rating: 0 - 5
    
    avg - 4
    (3 - 3.5 = 4)
    3 <= 4 => 100
*/

export default ProductCard;