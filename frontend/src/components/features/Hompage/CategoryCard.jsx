import { ArrowRight } from "lucide-react";
import { Button } from "../../common";

const CategoryCard = ({category}) => {
    return (
        <div className="shadow-base p-4 rounded-base max-w-60">
            <h1 className="text-2xl font-medium">{category}</h1>
            <Button className="bg-transparent text-dark hover:bg-green hover:text-base-white flex gap-1 mt-2 mx-auto group">
                See More
                <ArrowRight className="group-hover:text-base-white transition-all group-hover:rotate-0 -rotate-45" />
            </Button>
        </div>
    );
};

export default CategoryCard;