import { categories } from "../../../utils/dummy";
import { Container } from "../../common";
import CategoryCard from "./CategoryCard";

const CategoryShop = () => {
    return (
        <div className="text-center font-inter mb-20">
            <h1 className="text-5xl  max-sm:text-4xl text-center font-semibold text-dark">Shop By Category</h1>
            <p className="text-gray-600 mt-4">Get Quality Deals With All Specific Categories</p>

            <Container className="mx-auto gap-4 flex mt-8 px-4 justify-center flex-wrap items-center">
                {
                    categories.map((el) => <CategoryCard key={el} category={el} /> )
                }
            </Container>

            <h2 className="text-4xl mt-7 font-medium">And More...</h2>
        </div>
    );
};

export default CategoryShop;