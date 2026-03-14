const OrdersLoading = ({numOfCards = 4}) => {
    return (
        <div className="space-y-3">
            {Array.from({length: numOfCards}).map((i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="flex gap-2">
                  
                    <div className="w-22 h-12 bg-gray-100 rounded-xl" />
                  
                </div>
              </div>
            ))}
          </div>
    )
}

export default OrdersLoading;