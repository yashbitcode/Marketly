import { Container, Pagination } from "../components/common";
import SuperAdminProductsTable from "../components/features/super-admin/SuperAdminProductsTable";
import { useBaseProducts } from "../hooks";
import { useEffect } from "react";
import { ErrorToast } from "../utils/toasts";

const SuperAdminProducts = () => {
    const { products, loading, isError, error, pageHandler, page } = useBaseProducts();

    useEffect(() => {
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong");
    }, [isError, error]);

    return (
        <div className="min-h-screen font-inter bg-gray-50/50">
            <Container className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Management</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Review, approve, and manage all products across the platform
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-md">
                    {loading ? (
                        <div className="p-20 text-center flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium">Loading platform products...</p>
                        </div>
                    ) : (
                        <SuperAdminProductsTable products={products?.data} />
                    )}
                </div>

                {/* Pagination Controls */}
                {!loading && products?.data?.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination
                            page={page}
                            totalCount={products.totalCount} // useBaseProducts should provide totalCount
                            pageHandler={pageHandler}
                        />
                    </div>
                )}
            </Container>
        </div>
    );
};

export default SuperAdminProducts;
