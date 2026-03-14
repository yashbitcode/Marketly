import { useNavigate } from "react-router-dom";
import { Container } from "../components/common";
import useBaseOrders from "../hooks/useBaseOrders";
import { ShoppingBag } from "lucide-react";
import OrdersLoading from "../components/loadings/OrdersLoading";
import OrderCard from "../components/features/order/OrderCard";
import Pagination from "../components/common/Pagination";

const OrdersPage = () => {
    const navigate = useNavigate();
    const {
        orders,
        loading,
        isError,
        pageHandler,
        page,
    } = useBaseOrders();

    return (
        <div className="min-h-screen font-inter">
            <Container className="max-w-2xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="text-center w-fit mx-auto">
                        <h1 className="text-4xl font-medium text-gray-900">My Orders</h1>
                        <p className="text-sm text-gray-400 mt-2">
                            Track and manage your purchases
                        </p>
                    </div>
                </div>

                {loading ? (
                    <OrdersLoading />
                ) : (isError || !orders?.data || orders.data.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <ShoppingBag size={48} className="mb-3 opacity-20" />
                        <p className="font-medium text-xl">No orders yet</p>
                        <p className="text-xs mt-1">Your placed orders will appear here</p>
                    </div>
                ) : (
                    <>
                    <div className="space-y-3">
                        {orders?.data.map((order) => (
                            <OrderCard
                                key={order._id}
                                order={order.order}
                                onClick={() => navigate(`/orders/${order._id}`)}
                            />
                        ))}
                    </div>

                    {orders?.data && (
                                <Pagination
                                    page={page}
                                    totalCount={orders?.totalCount}
                                    pageHandler={pageHandler}
                                />
                            )}
                        </>
                )}
            </Container>
        </div>
    );
};

export default OrdersPage;
