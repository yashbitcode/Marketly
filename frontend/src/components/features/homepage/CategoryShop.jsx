import { useCategories } from "../../../hooks";
import { Container } from "../../common";
import CategoryCard from "./CategoryCard";
import CategoryCardSkeleton from "../../loadings/CategoryCardSkeleton";
import { getFormatedStr, trimStr } from "../../../utils/helpers";
import { Link } from "react-router";

const CategoryShop = () => {
    const { categories, loading } = useCategories();

    return (
        <div className="text-center font-inter mb-20">
            <h1 className="text-5xl  max-sm:text-4xl text-center font-semibold text-dark">
                Shop By Category
            </h1>
            <p className="text-gray-600 mt-4 italic">
                Get Quality Deals With All Specific Categories
            </p>

            <Container className="mx-auto gap-4 flex mt-8 px-4 justify-center flex-wrap items-center">
                {!loading
                    ? Array.from({ length: 5 }).map((_, idx) => (
                          <CategoryCard
                              key={categories.parentCategories[idx]._id}
                              category={trimStr(
                                  getFormatedStr(categories.parentCategories[idx].name),
                                  15,
                              )}
                              slug={categories.parentCategories[idx].slug}
                          />
                      ))
                    : Array.from({ length: 5 }).map((_, idx) => <CategoryCardSkeleton key={idx} />)}
            </Container>

            <div className="mt-10">
                <Link to={"/products"} className="text-4xl font-medium">
                    And More...
                </Link>
            </div>
        </div>
    );
};

export default CategoryShop;
