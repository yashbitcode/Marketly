const PaymentFailed = ({
    amount = "₹2,499.00",
    reason = "Insufficient funds",
    errorCode = "BAD_REQUEST_ERROR",
    date = "12 Mar 2026"
    
}) => (
    <div className="px-4">
        <div className="bg-white rounded-2xl border my-10 mx-auto border-gray-100 overflow-hidden max-w-80 shadow-sm">
            <div className="bg-red-50 px-6 py-5 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                        className="w-6 h-6 text-red-700"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </div>
                <p className="text-red-800 font-medium text-sm">Payment failed</p>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-500 text-sm">Amount</span>
                    <span className="text-xl font-medium text-gray-900">{amount}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                    <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Reason</span>
                        <span className="text-xs text-red-600">{reason}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Error code</span>
                        <span className="text-xs text-gray-700 font-mono">{errorCode}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Date</span>
                        <span className="text-xs text-gray-700">{date}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default PaymentFailed;
