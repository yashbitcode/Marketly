import { useProducts } from "../../../hooks";
import { Container } from "../../common";
import ProductCardSkeleton from "../../loadings/ProductCardSkeleton";
import ProductCard from "../products/ProductCard";

const TrendyProducts = () => {
    const { products, loading } = useProducts();

    return (
        <div className="bg-green px-4 py-20 font-inter my-20">
            <h1 className="text-5xl max-sm:text-4xl text-center font-semibold text-base-white">
                Trendy Products
            </h1>

            <Container className="mx-auto mt-10">
                <div className="grid grid-cols-4 max-[1080px]:grid-cols-2 max-[570px]:grid-cols-1  items-center w-fit mx-auto gap-4">
                    {!loading || products?.data
                        ? Array.from({ length: 8 }).map((_, idx) => (
                              <ProductCard key={products?.data[idx]._id} {...products?.data[idx]} />
                          )) 
                        : Array.from({ length: 8 }).map((_, idx) => (
                              <ProductCardSkeleton key={idx} />
                          ))}
                </div>
            </Container>
        </div>
    );
};

export default TrendyProducts;
