import { Edit, Trash2 } from "lucide-react";
import { formatPrice, getFormatedStr } from "../../../utils/helpers";
import { Button } from "../../common";

const VendorProductsTable = ({ products }) => {
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] text-left font-inter border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase bg-gray-50/50">
                        <th className="p-4 font-medium">Product</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Price</th>
                        <th className="p-4 font-medium">Stock</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.length > 0 ? (
                        products.map((product) => (
                            <tr
                                key={product._id?.$oid || product._id}
                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
                                            {product.images && product.images[0] ? (
                                                <img
                                                    src={product.images[0].thumbnailUrl || product.images[0].url}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gray-200" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm line-clamp-1 max-w-[200px]" title={product.name}>
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {product.brandName && getFormatedStr(product.brandName)}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {/* Category logic can be improved if we populate the category names */}
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        {product.category?.name || "Category"}
                                    </span>
                                </td>
                                <td className="p-4 text-sm font-medium text-gray-900">
                                    {product.currency || "₹"}{formatPrice(product.price)}
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            product.stockQuantity > 10
                                                ? "bg-green-100 text-green-700"
                                                : product.stockQuantity > 0
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
                                    </span>
                                </td>
                                <td className="p-4">
                                     <div className="flex flex-col gap-1 items-start">
                                        <span
                                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                product.approval?.status === "accepted"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : product.approval?.status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {getFormatedStr(product.approval?.status || "Pending")}
                                        </span>
                                        {!product.isActive && (
                                            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-500">
                                                Inactive
                                            </span>
                                        )}
                                     </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            title="Edit Product"
                                            className="p-1.5 bg-transparent shadow-none text-gray-400 hover:text-orange hover:bg-orange-50 rounded-md transition-colors"
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            title="Delete Product"
                                            className="p-1.5 bg-transparent shadow-none text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-8 text-center text-gray-500">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VendorProductsTable;
