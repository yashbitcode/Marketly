import { Container, Pagination } from "../components/common";
import VendorApplicationsTable from "../components/features/super-admin/VendorApplicationsTable";
import VendorApplicationModal from "../components/features/super-admin/VendorApplicationModal";
import RemarksModal from "../components/features/super-admin/RemarksModal";
import { useEffect, useState } from "react";
import { VendorApplicationApi } from "../apis";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "../utils/toasts";

const SuperAdminVendorApplications = () => {
    const [page, setPage] = useState(1);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [actionStatus, setActionStatus] = useState(null); 
    const queryClient = useQueryClient();

    const { data: applicationsData, isLoading, isError, error } = useQuery({
        queryKey: ["vendor-applications", page],
        queryFn: () => VendorApplicationApi.getAllApplications(page),
        staleTime: 0
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status, remarks }) => VendorApplicationApi.updateStatus(id, { applicationStatus: status, remarks }),
        onSuccess: (res) => {
            SuccessToast(res?.message || "Application status updated");
            queryClient.invalidateQueries(["vendor-applications"]);
            setSelectedApplication(null);
            setActionStatus(null);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Something went wrong"),
    });

    useEffect(() => {
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong");
    }, [isError, error]);

    const pageHandler = (pageNum) => setPage(pageNum);

    const handleStatusUpdate = (id, status) => {
        if (status === "view") {
            setSelectedApplication(id);
            return;
        }
        setActionStatus({ id, status });
    };

    const handleConfirmStatus = (remarks) => {
        updateStatusMutation.mutate({ 
            id: actionStatus.id, 
            status: actionStatus.status, 
            remarks 
        });
    };

    return (
        <div className="min-h-screen font-inter bg-gray-50/50">
            <Container className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vendor Applications</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Review and approve new vendor requests for the platform
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-md">
                    {isLoading ? (
                        <div className="p-20 text-center flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium tracking-tight">Loading applications...</p>
                        </div>
                    ) : (
                        <VendorApplicationsTable 
                            applications={applicationsData?.data?.applications} 
                            onStatusUpdate={handleStatusUpdate}
                            loadingId={updateStatusMutation.isPending ? updateStatusMutation.variables?.id : null}
                        />
                    )}
                </div>

                {/* Pagination Controls */}
                {!isLoading && applicationsData?.data?.applications?.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination
                            page={page}
                            totalCount={applicationsData.data.totalCount}
                            pageHandler={pageHandler}
                        />
                    </div>
                )}
            </Container>

            {selectedApplication && (
                <VendorApplicationModal 
                    application={selectedApplication} 
                    onClose={() => setSelectedApplication(null)} 
                />
            )}

            {actionStatus && (
                <RemarksModal 
                    status={actionStatus.status}
                    onConfirm={handleConfirmStatus}
                    onClose={() => setActionStatus(null)}
                />
            )}
        </div>
    );
};

export default SuperAdminVendorApplications;
