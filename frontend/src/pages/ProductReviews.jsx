import { useParams } from "react-router";
import { Button, Container } from "../components/common";
import { useAuth, useReviews } from "../hooks";
import Loader from "../components/loadings/Loader";
import Pagination from "../components/common/Pagination";
import ReviewCard from "../components/features/products/ReviewCard";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddReviewModal from "../components/features/products/AddReviewModal";

const ProductReviews = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const { reviews, page, pageHandler, loading } = useReviews(slug);
    const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

    if (loading) return <Loader />;

    return (
        <Container className="max-w-xl mx-auto my-10 px-4 font-inter">
            <div className="relative w-full flex flex-col items-center">
                <h1 className="text-4xl text-center">Product Reviews</h1>
                {user && (
                    <Button
                        onClick={() => setIsAddReviewOpen(true)}
                        className="bg-black text-white p-1 max-sm:mt-6 sm:absolute sm:top-1 w-fit sm:right-4"
                        title="Add Reviews"
                    >
                        <Plus />
                    </Button>
                )}
            </div>
            <div className="space-y-4 w-full mt-8">
                {reviews?.data?.map((review, idx) => (
                    <ReviewCard key={idx} {...review} />
                ))}
            </div>

            <Pagination page={page} totalCount={reviews?.totalCount} pageHandler={pageHandler} />

            {isAddReviewOpen && user && (
                <AddReviewModal onClose={() => setIsAddReviewOpen(false)} slug={slug} page={page} />
            )}
        </Container>
    );
};

export default ProductReviews;
