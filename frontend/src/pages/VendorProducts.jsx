import { useState } from "react";
import { Container, Pagination } from "../components/common";
import VendorProductsTable from "../components/features/vendor/VendorProductsTable";
import { Plus } from "lucide-react";
import { PAGINATION_LIMIT } from "../../../shared/constants";
import { Link } from "react-router";
import { MOCK_PRODUCTS } from "../utils/dummy";

const VendorProducts = () => {
    const [page, setPage] = useState(1);
    
    // Simulate pagination for MOCK_PRODUCTS.
    const loading = false;
    
    // Create an artificially long total list by repeating elements 
    // just so we have multiple pages to demonstrate pagination visually.
    const SUPER_MOCK_PRODUCTS = [...MOCK_PRODUCTS, ...MOCK_PRODUCTS, ...MOCK_PRODUCTS, ...MOCK_PRODUCTS, ...MOCK_PRODUCTS, ...MOCK_PRODUCTS];
    
    const paginatedProducts = SUPER_MOCK_PRODUCTS.slice(
        (page - 1) * PAGINATION_LIMIT,
        page * PAGINATION_LIMIT
    );

    return (
        <div className="min-h-screen font-inter bg-[#f8f9fa]">
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
                                className="flex items-center gap-2 bg-orange text-white hover:bg-opacity-90 px-4 py-2 rounded-lg transition-all"
                            >
                                <Plus size={18} />
                                <span>Add Product</span>
                            </Link>
                    </div>
                </div>

                    <>
                        <div className="bg-white rounded-xl shadow-base border border-gray-100 overflow-hidden mb-6">
                            {loading ? (
                                <div className="p-12 text-center text-gray-500">Loading products...</div>
                            ) : (
                                <VendorProductsTable products={paginatedProducts} />
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {!loading && SUPER_MOCK_PRODUCTS.length > 0 && (
                            <Pagination 
                                page={page} 
                                totalCount={SUPER_MOCK_PRODUCTS.length} 
                                pageHandler={setPage} 
                            />
                        )}
                    </>
            
            </Container>
        </div>
    );
};

export default VendorProducts;
