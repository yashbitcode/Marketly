import { useEffect, useState } from "react";
import ReviewApi from "../apis/reviewApi";
import toast from "react-hot-toast";

const useReviews = (slug) => {
    const [reviews, setReviews] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await ReviewApi.getAll(slug, page);

                if (res?.data?.success) setReviews(res.data.data);
            } catch (err) {
                toast.error(err?.response?.data?.message || "Something went wrong", {
                    position: "right-top",
                });
            }
        };
        fetchReviews();
    }, [page, slug]);

    return { reviews, page, setPage };
};

export default useReviews;
