import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const CategoryCard = ({ category, slug }) => {
    return (
        <div className="shadow-base p-4 rounded-base w-full max-w-60">
            <h1 className="text-2xl font-medium">{category}</h1>
            <Link
                to={`/products?categories=${slug}`}
                className="bg-transparent text-dark w-fit px-3 py-1 rounded-full hover:bg-green hover:text-base-white flex gap-1 mt-2 mx-auto group "
            >
                See More
                <ArrowRight className="group-hover:text-base-white transition-all group-hover:rotate-0 -rotate-45" />
            </Link>
        </div>
    );
};

export default CategoryCard;
