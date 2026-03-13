const PaymentSuccess = ({
    amount = "₹2,499.00",
    txnId = "pay_Qx8kR2mTvN4pL",
    method = "UPI · GPay",
    date = "12 Mar 2026",
}) => (
    <div className="px-4">
    <div className="bg-white rounded-2xl my-10 mx-auto border-gray-100 overflow-hidden max-w-80 shadow-base">
        <div className="bg-green-50 px-6 py-5 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                    className="w-6 h-6 text-green-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <p className="text-green-800 font-medium text-sm">Payment successful</p>
        </div>
        <div className="p-5">
            <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500 text-sm">Amount</span>
                <span className="text-xl font-medium text-gray-900">{amount}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Transaction ID</span>
                    <span className="text-xs text-gray-700 font-mono">{txnId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Method</span>
                    <span className="text-xs text-gray-700">{method}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Date</span>
                    <span className="text-xs text-gray-700">{date}</span>
                </div>
            </div>
            <button className="mt-4 w-full py-2 text-sm rounded-lg bg-green-50 border border-green-200 text-green-800 hover:bg-green-100 transition-colors">
                View receipt
            </button>
        </div>
    </div>
    </div>
);

export default PaymentSuccess;
