import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "."
import { PAGINATION_LIMIT } from "../../../../shared/constants"

const Pagination = ({page = 1, totalCount = 1, pageHandler}) => {
    // console.log(totalCount)
    const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT) || 1;
    page = totalPages < page ? totalPages : page;

    return (
        <div className="mt-8 mx-auto w-fit flex items-center gap-4 ">
            <Button className="bg-transparent shadow-base text-[1.1rem] text-dark rounded-[7px]" disabled={page <= 1} onClick={() => pageHandler(page - 1)}><ChevronLeft /></Button>
            <span className={"text-xl"}>{page} of {totalPages}</span>
            <Button className="bg-transparent shadow-base text-[1.1rem] text-dark rounded-[7px]" disabled={page === totalPages} onClick={() => pageHandler(page + 1)}><ChevronRight /></Button>
        </div>
    )
}
export default Pagination