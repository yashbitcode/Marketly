import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from ".";
import { PAGINATION_LIMIT } from "shared/constants";

const Pagination = ({ page = 1, totalCount = 1, pageHandler }) => {
    const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT) || 1;
    page = totalPages < page ? totalPages : page;

    return (
        <div className="flex items-center justify-center gap-6 mt-8">
            <Button
                className={`p-2 rounded-xl border border-gray-200 bg-white transition-all duration-200 shadow-base 
                    ${page <= 1 ? "opacity-50 cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"}`}
                disabled={page <= 1}
                onClick={() => pageHandler(page - 1)}
            >
                <ChevronLeft size={20} />
            </Button>
            
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                    Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
                </span>
            </div>

            <Button
                className={`p-2 shadow-base rounded-xl border border-gray-200 bg-white transition-all duration-200 
                    ${page === totalPages ? "opacity-50 cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"}`}
                disabled={page === totalPages}
                onClick={() => pageHandler(page + 1)}
            >
                <ChevronRight size={20} />
            </Button>
        </div>
    );
};
export default Pagination;
