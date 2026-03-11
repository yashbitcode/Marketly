import { useForm } from "react-hook-form";
import { Button, Input } from "../../common";
import { ReviewApi, UserApi } from "../../../apis";
import Loader from "../../loadings/Loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductReviewValidations } from "../../../../../shared/validations/review.validations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";

const AddReviewModal = ({ onClose, slug, page }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            slug,
        },
        resolver: zodResolver(addProductReviewValidations),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data) => ReviewApi.addReview(data),
        onSuccess: (res) => {
            SuccessToast(res.message);
            queryClient.invalidateQueries({ queryKey: ["reviews", slug, page] });
            onClose();
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Something went wrong"),
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-base p-6 w-full max-w-lg space-y-6">
                <h3 className="text-lg font-semibold">Add Review</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Slug"
                        placeholder="Slug"
                        {...register("slug")}
                        error={errors?.slug?.message}
                        disabled
                    />

                    <Input
                        label="Ratings"
                        placeholder="Ratings"
                        {...register("ratings", {
                            valueAsNumber: true,
                        })}
                        type="number"
                        className="no-spinner"
                        error={errors?.ratings?.message}
                    />

                    <Input
                        label="Heading"
                        placeholder="Heading"
                        {...register("heading")}
                        error={errors?.heading?.message}
                    />

                    <Input
                        label="Comment"
                        placeholder="Comment"
                        {...register("comment")}
                        error={errors?.comment?.message}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="px-4 py-2 rounded-base"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="px-4 py-2 flex justify-center items-center gap-4 bg-black text-white rounded-base"
                            disabled={isSubmitting}
                        >
                            {mutation.isPending ? (
                                <>
                                    <div className="w-fit">
                                        <Loader />
                                    </div>
                                    Loading...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReviewModal;
