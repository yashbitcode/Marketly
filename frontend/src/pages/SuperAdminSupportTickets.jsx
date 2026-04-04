import { Container, Pagination } from "../components/common";
import SupportTicketsTable from "../components/features/super-admin/SupportTicketsTable";
import SupportTicketModal from "../components/features/super-admin/SupportTicketModal";
import { useEffect, useState } from "react";
import { SupportApi } from "../apis";
import { useQuery } from "@tanstack/react-query";
import { ErrorToast } from "../utils/toasts";
import { MessageSquare } from "lucide-react";

const SuperAdminSupportTickets = () => {
    const [page, setPage] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const { data: ticketsData, isLoading, isError, error } = useQuery({
        queryKey: ["support-tickets", page],
        queryFn: () => SupportApi.getAllTickets(page),
        staleTime: 5 * 60 * 1000, 
    });

    useEffect(() => {
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong while fetching tickets");
    }, [isError, error]);

    const pageHandler = (pageNum) => setPage(pageNum);

    const handleViewDetails = (ticket) => {
        setSelectedTicket(ticket);
    };

    return (
        <div className="min-h-screen font-inter bg-gray-50/50">
            <Container className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-orange rounded-lg text-white">
                                <MessageSquare size={20} />
                             </div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Support Tickets</h1>
                        </div>
                        <p className="text-sm text-gray-500">
                            Monitor and manage user queries and support requests
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-md">
                    {isLoading ? (
                        <div className="p-20 text-center flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium tracking-tight">Loading tickets...</p>
                        </div>
                    ) : (
                        <SupportTicketsTable 
                            tickets={ticketsData?.data?.tickets} 
                            onViewDetails={handleViewDetails}
                        />
                    )}
                </div>

                {/* Pagination Controls */}
                {!isLoading && ticketsData?.data?.totalCount > 0 && (
                    <div className="flex justify-center">
                        <Pagination
                            page={page}
                            totalCount={ticketsData.data.totalCount}
                            pageHandler={pageHandler}
                        />
                    </div>
                )}
            </Container>

            {selectedTicket && (
                <SupportTicketModal 
                    ticket={selectedTicket} 
                    onClose={() => setSelectedTicket(null)} 
                />
            )}
        </div>
    );
};

export default SuperAdminSupportTickets;
