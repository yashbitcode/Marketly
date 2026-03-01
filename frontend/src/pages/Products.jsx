import { Search } from "lucide-react"
import { Button, Container, Input } from "../components/common"
import ProductsFilter from "../components/features/products/ProductsFilter";
import ProductCard from "../components/features/products/ProductCard";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CategoryApi from "../apis/categoryApi";
import ProductApi from "../apis/productApi";
import Pagination from "../components/common/Pagination";
import { PAGINATION_LIMIT } from "../../../shared/constants";

const Products = () => {
    const [categories, setCategories] = useState(null);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageError, setPageError] = useState(null);

    // console.log(products)

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setPageError(null);
            const {data} = await ProductApi.getAllFilteredProducts({}, page);
            
            if(Math.ceil(data?.data.totalCount || 1 / PAGINATION_LIMIT) >= page) setProducts(data?.data || []);
            else setPageError("Invalid Page Number");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong", {
                position: "right-top"
            });
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        console.log("HIHI")
        const fetchData = async () => {
            try {
                const categoriesRes = await CategoryApi.getAllCategories();
                setCategories(categoriesRes?.data?.data);
            } catch (err) {
                toast.error(err?.response?.data?.message || "Something went wrong", {
                    position: "right-top"
                });
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if(loading) return <div>loading...</div>

    return (
        <Container className="w-full max-w-350 mx-auto my-8">
            <div className="w-full border-2 rounded-full border-gray-200 gap-1.5 bg-base-white p-2 flex items-center max-w-130 mx-auto">
                <Search className="text-gray-400" />
                <Input className="w-full p-0 border-0 rounded-none" />
                <Button className="bg-orange">Search</Button>
            </div>
            <div className="flex mt-8 w-full relative">
                <div className="sticky top-4 h-full">
                    <ProductsFilter categories={categories?.parentCategories} subCategories={categories?.subCategories} />
                </div>
                {
                    !pageError ? (
                        <div className="mx-auto">
                    <div className="grid grid-cols-4 max-[1080px]:grid-cols-2 max-[570px]:grid-cols-1  items-center w-fit mr-4 gap-4">
                        {
                            products?.data?.map((el) => <ProductCard key={el._id} {...el} />)
                        }
                    </div>
                    <Pagination page={page} totalCount={products?.totalCount} pageHandler={(newPage) => setPage(newPage)} />
                </div>
                    ) : (
                        <div className="px-2 py-1 shadow-base">{pageError}</div>
                    )
                }
            </div>
        </Container>
    )
}

export default Products;