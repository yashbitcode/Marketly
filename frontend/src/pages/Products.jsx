import { Search, SlidersHorizontal } from "lucide-react";
import { Button, Container, Input } from "../components/common";
import ProductsFilter from "../components/features/products/ProductsFilter";
import ProductCard from "../components/features/products/ProductCard";
import Pagination from "../components/common/Pagination";
import { useCategories } from "../hooks";
import { useProducts } from "../hooks";
import { useState } from "react";
import ProductCardSkeleton from "../components/loadings/ProductCardSkeleton";

const Products = () => {
    const { categories } = useCategories();
    const {
        products,
        loading,
        isError,
        error,
        pageHandler,
        setSearchParams,
        searchParams,
        page,
        search,
        searchHandler,
    } = useProducts();
    const [filterMenu, setFilterMenu] = useState(false);

    // console.log(products)
    // console.log(categories)

    return (
        <>
            <div
                className={`fixed top-0 z-10 h-full w-full bg-black/30 min-[1100px]:hidden ${!filterMenu && "hidden"}`}
            />
            <Container className="w-full max-w-350 mx-auto my-8 font-inter">
                <div className="px-4">
                    <div className="w-full border-2 rounded-full border-gray-200 gap-1.5 bg-gray-50 p-2 flex items-center mx-auto max-w-130">
                        <Search className="text-gray-400" />
                        <Input
                            className="w-full p-0 border-0 rounded-none"
                            value={search}
                            onChange={searchHandler}
                        />
                        <Button
                            className="bg-orange"
                            onClick={() => {
                                setSearchParams((prev) => {
                                    prev.set("searchQuery", search);

                                    return prev;
                                });

                                pageHandler(1);
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>
                <Button
                    className="px-4 py-0 bg-transparent text-dark mt-3 min-[1100px]:hidden flex items-center gap-2"
                    onClick={() => setFilterMenu(!filterMenu)}
                >
                    <SlidersHorizontal />
                    <span className="text-xl">Filters</span>
                </Button>
                <div className="flex mt-8 w-full relative">
                    <div
                        className={`min-[1100px]:sticky min-[1100px]:top-4 h-full max-[1100px]:z-90 max-[1100px]:absolute max-[1100px]:-top-45 max-[1100px]:mx-auto max-[1100px]:left-1/2 max-[1100px]:-translate-x-1/2 ${!filterMenu && "max-[1100px]:hidden"}`}
                    >
                        <ProductsFilter
                            filters={Object.fromEntries([...searchParams])}
                            categories={categories?.parentCategories}
                            subCategories={categories?.subCategories}
                            onApply={(appliedFilters) => {
                                if (search) appliedFilters.searchQuery = search;

                                setSearchParams(appliedFilters);
                                pageHandler(1);
                            }}
                            menuHandler={() => setFilterMenu(false)}
                        />
                    </div>
                    {!(isError && error) ? (
                        <div className="mx-auto">
                            <div className="grid grid-cols-4 max-[1360px]:grid-cols-3 max-[750px]:grid-cols-2 max-[540px]:grid-cols-1 items-center w-fit mr-4 max-[1100px]:mx-4 gap-3">
                                {!loading
                                    ? products?.data?.map((el) => (
                                          <ProductCard key={el._id} {...el} />
                                      ))
                                    : Array.from({ length: 8 }).map((_, idx) => (
                                          <ProductCardSkeleton key={idx} />
                                      ))}
                            </div>
                            {products && (
                                <Pagination
                                    page={page}
                                    totalCount={products?.totalCount}
                                    pageHandler={pageHandler}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="px-2 py-1 shadow-base h-full rounded-[7px] text-2xl m-auto -rotate-10">
                            {error}
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

export default Products;
