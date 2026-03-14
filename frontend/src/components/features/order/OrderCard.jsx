import { ChevronRight, Clock } from "lucide-react";
import { STATUS_STYLE } from "../../../utils/constants";
import { formatPrice } from "../../../utils/helpers";

const OrderCard = ({ order, onClick }) => {
    const payStatus = STATUS_STYLE[order.status] || STATUS_STYLE.pending;

    const formattedDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });


    return (
        <div
            onClick={onClick}
            className="bg-white shadow-base rounded-lg p-4 cursor-pointer transition-all hover:scale-102 font-inter"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <p className="text-xs text-gray-400 font-medium">{order.orderId}</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">₹{formatPrice((order.amount / 100).toFixed(1))}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${payStatus.bg} ${payStatus.text}`}
                    >
                        {payStatus.label}
                    </span>
                    <ChevronRight
                        size={16}
                        className="text-gray-300 group-hover:text-orange-400 transition-colors"
                    />
                </div>
            </div>

            <div className="ml-auto text-right">
                <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                    <Clock size={10} /> {formattedDate}
                </p>
            </div>
        </div>
    );
};
export default OrderCard;