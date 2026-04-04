import { Container, Pagination } from "../components/common";
import VendorPayoutsTable from "../components/features/super-admin/VendorPayoutsTable";
import { useCallback, useEffect, useState } from "react";
import { VendorPayoutApi } from "../apis";
import { useQuery } from "@tanstack/react-query";
import { ErrorToast } from "../utils/toasts";

const SuperAdminVendorPayouts = () => {
     const [page, setPage] = useState(1);
    const { data: payoutsData, isLoading, isError, error } = useQuery({
        queryKey: ["vendor-payouts", page],
        queryFn: () => VendorPayoutApi.getAll(page),
        staleTime: 0
    });

     const pageHandler = useCallback((pageNum) => {
            setPage(pageNum);
        }, []);


    console.log(payoutsData)

    useEffect(() => {
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong");
    }, [isError, error]);

    return (
        <div className="min-h-screen font-inter bg-gray-50/50">
            <Container className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vendor Payouts</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Oversee all payments and transactions made to platform vendors
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-md">
                    {isLoading ? (
                        <div className="p-20 text-center flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Fetching Payouts...</p>
                        </div>
                    ) : (
                        <VendorPayoutsTable payouts={payoutsData?.data?.vendorPayouts} />
                    )}
                </div>

                {!isLoading && payoutsData?.data?.vendorPayouts?.length > 0 && (
                                    <div className="flex justify-center mt-6">
                                        <Pagination
                                            page={page}
                                            totalCount={payoutsData?.data?.totalCount}
                                            pageHandler={pageHandler}
                                        />
                                    </div>
                                )}
            </Container>
        </div>
    );
};

export default SuperAdminVendorPayouts;
