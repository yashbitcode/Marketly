import { Container, Pagination } from "../components/common";
import VendorOrdersTable from "../components/features/vendor/VendorOrdersTables";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ErrorToast } from "../utils/toasts";
import { useAuth } from "../hooks";
import { useState } from "react";
import { useCallback } from "react";
import { OrderApi } from "../apis";

const VendorOrders = () => {
    const {user} = useAuth();
    const [page, setPage] = useState(1);
    const {data: orders, loading, isError, error} = useQuery({
        queryKey: ["vendor-orders", user?.vendorId?._id, page],
        queryFn: () => OrderApi.getAllVendorOrders(page),
    })

    const pageHandler = useCallback((pageNum) => {
            setPage(pageNum);
        }, []);


    useEffect(() => {
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong");
    }, [isError, error]);

    return (
        <div className="min-h-screen font-inter">
            <Container className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your store's orders and delivery
                        </p>
                    </div>
                   
                </div>

                <>
                    <div className="bg-white rounded-xl shadow-base border border-gray-100 overflow-hidden mb-6">
                        {loading ? (
                            <div className="p-12 text-center text-gray-500">
                                Loading products...
                            </div>
                        ) : (
                            <VendorOrdersTable orders={orders?.data?.data   } />
                        )} 
                    </div>

                    {/* Pagination Controls */}
                    {!loading && orders?.data?.data?.length > 0 && (
                        <Pagination
                            page={page}
                            totalCount={orders?.data?.data}
                            pageHandler={pageHandler}
                        />
                    )}
                </>
            </Container>
        </div>
    );
};

export default VendorOrders;
