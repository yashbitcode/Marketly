import { Container, Pagination } from "../components/common";
import VendorProductsTable from "../components/features/vendor/VendorProductsTable";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { useBaseProducts } from "../hooks";
import { useEffect } from "react";
import { ErrorToast } from "../utils/toasts";

const VendorProducts = () => {
    const { products, loading, isError, error, pageHandler, page } = useBaseProducts();

    useEffect(() => {
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong");
    }, [isError, error]);

    return (
        <div className="min-h-screen font-inter">
            <Container className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your store's inventory and product listings
                        </p>
                    </div>
                    <div>
                        <Link
                            to={"/vendor/products/add"}
                            className="flex items-center gap-2 bg-orange text-white hover:bg-opacity-90 px-4 py-2 w-fit rounded-lg transition-all"
                        >
                            <Plus size={18} />
                            <span>Add Product</span>
                        </Link>
                    </div>
                </div>

                <>
                    <div className="bg-white rounded-xl shadow-base border border-gray-100 overflow-hidden mb-6">
                        {loading ? (
                            <div className="p-12 text-center text-gray-500">
                                Loading products...
                            </div>
                        ) : (
                            <VendorProductsTable products={products?.data} />
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {!loading && products?.data?.length > 0 && (
                        <Pagination
                            page={page}
                            totalCount={products.data}
                            pageHandler={pageHandler}
                        />
                    )}
                </>
            </Container>
        </div>
    );
};

export default VendorProducts;
