import { ArrowRight } from "lucide-react";
import { Button } from "../../common";
import RenderStars from "../base-star/RenderStars";

const TopVendorCard = ({ storeName, storeImg, avgRating }) => {
    return (
        <div className="shadow-base p-4 rounded-base w-full max-w-60 flex flex-col items-center gap-2">
            <div className="size-15 flex justify-center items-center rounded-full bg-base-white p-4 mx-auto ">
                <img
                    src={storeImg}
                    alt={storeName}
                    className="w-full max-w-10"
                />
            </div>
            <h1 className="text-xl font-medium">{storeName}</h1>

            <RenderStars avgRating={avgRating} />

            <Button className="text-dark hover:bg-orange hover:text-base-white mt-1 bg-base-white mx-auto group p-0 size-10 flex justify-center items-center">
                <ArrowRight className="group-hover:text-base-white transition-all group-hover:rotate-0 -rotate-45" />
            </Button>
        </div>
    );
};

export default TopVendorCard;
