import { Container, Pagination } from "../components/common";
import AllChatsTable from "../components/features/chat/AllChatsTable";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import { ErrorToast } from "../utils/toasts";
import { ChatApi } from "../apis";
import Loader from "../components/loadings/Loader";

const AllChats = () => {
    const [page, setPage] = useState(1);
    
    const { data: chats, isLoading, isError, error } = useQuery({
        queryKey: ["all-chats", page],
        queryFn: () => ChatApi.getAllChatsReqs(page),
    });

    const pageHandler = useCallback((pageNum) => {
        setPage(pageNum);
    }, []);

    useEffect(() => {
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong fetching chats");
    }, [isError, error]);

    if (isLoading) return <Loader />;

    return (
        <div className="min-h-screen font-inter bg-stone-50/50">
            <Container className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-medium text-gray-900">Messages & Chat Requests</h1>
                        <p className="text-sm text-slate-500 mt-2 font-medium">
                            Manage all your communications and active support requests in one place.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden mb-8 transition-all hover:shadow-2xl">
                    <AllChatsTable chats={chats?.data?.data} />
                </div>

                {!isLoading && chats?.data?.data?.length > 0 && (
                    <div className="flex justify-center mt-6">
                        <Pagination
                            page={page}
                            totalCount={chats?.data?.totalCount}
                            pageHandler={pageHandler}
                        />
                    </div>
                )}
            </Container>
        </div>
    );
};

export default AllChats;
