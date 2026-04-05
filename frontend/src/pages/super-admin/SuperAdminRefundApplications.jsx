import { Container, Pagination, Error, Button } from "../../components/common";
import { CreditCard, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RefundApplicationsTable from "../../components/features/super-admin/RefundApplicationsTable";
import { useRefundApplications } from "../../hooks";
import Loader from "../../components/loadings/Loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefundApplicationApi } from "../../apis";
import { SuccessToast, ErrorToast } from "../../utils/toasts";
import { useState } from "react";
import RefundApplicationModal from "../../components/features/super-admin/RefundApplicationModal";

const SuperAdminRefundApplications = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedApplication, setSelectedApplication] = useState(null);

    const { 
        applications, 
        loading, 
        isError, 
        error, 
        totalCount, 
        page, 
        pageHandler 
    } = useRefundApplications();

    const processRefundMutation = useMutation({
        mutationFn: (applicationId) => RefundApplicationApi.processRefund(applicationId),
        onSuccess: (res) => {
            SuccessToast(res?.message || "Refund processed successfully");
            queryClient.invalidateQueries(["refund-applications"]);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Something went wrong"),
    });

    const handleStatusUpdate = (app, type) => {
        if (type === "view") {
            setSelectedApplication(app);
            return;
        }
        if (type === "refunded") {
             const isConfirmed = window.confirm("Are you sure you want to process this refund? This action will refund the amount to the customer's original payment method via Razorpay.");
             if (isConfirmed) processRefundMutation.mutate(app);
        }
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader /></div>;
    if (isError) return <div className="p-10"><Error error={error} /></div>;

    return (
        <div className="min-h-screen font-inter bg-gray-50/50 pb-10">
            <Container className="max-w-7xl mx-auto px-4 py-8">
                <Button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange transition-colors mb-6 font-bold bg-transparent border-none outline-none cursor-pointer"
                >
                    <ArrowLeft size={16} /> Back
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-orange/10 rounded-lg shrink-0">
                                <CreditCard size={24} className="text-orange" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Refund Requests</h1>
                        </div>
                        <p className="text-sm text-gray-500 font-medium ml-14">
                            Manage and process customer refund applications via Razorpay.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-md">
                    <RefundApplicationsTable 
                        applications={applications} 
                        onStatusUpdate={handleStatusUpdate}
                        loadingId={processRefundMutation.isPending ? processRefundMutation.variables : null}
                    />
                </div>

                {totalCount > 10 && (
                    <div className="flex justify-center mt-8">
                        <Pagination 
                            totalCount={totalCount} 
                            page={page} 
                            pageHandler={pageHandler} 
                        />
                    </div>
                )}
            </Container>

            {selectedApplication && (
                <RefundApplicationModal 
                    application={selectedApplication} 
                    onClose={() => setSelectedApplication(null)} 
                />
            )}
        </div>
    );
};

export default SuperAdminRefundApplications;
