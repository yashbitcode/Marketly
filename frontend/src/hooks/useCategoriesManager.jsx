import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryApi } from "../apis";
import { SuccessToast, ErrorToast } from "../utils/toasts";
import useCategories from "./useCategories";

const useCategoriesManager = () => {
    const queryClient = useQueryClient();

    const { categories, loading } = useCategories();

    console.log(categories)

    const addParentMutation = useMutation({
        mutationFn: CategoryApi.addParentCategory,
        onSuccess: (res) => {
            SuccessToast(res.message);
            queryClient.invalidateQueries(["category"]);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Operation failed"),
    });

    const addSubMutation = useMutation({
        mutationFn: CategoryApi.addSubCategory,
        onSuccess: (res) => {
            SuccessToast(res.message);
            queryClient.invalidateQueries(["category"]);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Operation failed"),
    });

    const updateParentMutation = useMutation({
        mutationFn: ({ slug, payload }) => CategoryApi.updateParentCategory(slug, payload),
        onSuccess: (res) => {
            SuccessToast(res.message);
            queryClient.invalidateQueries(["category"]);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Operation failed"),
    });

    const updateSubMutation = useMutation({
        mutationFn: ({ slug, payload }) => CategoryApi.updateSubCategory(slug, payload),
        onSuccess: (res) => {
            SuccessToast(res.message);
            queryClient.invalidateQueries(["category"]);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Operation failed"),
    });

    const deleteParentMutation = useMutation({
        mutationFn: CategoryApi.deleteParentCategory,
        onSuccess: (res) => {
            SuccessToast(res.message);
            queryClient.invalidateQueries(["category"]);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Operation failed"),
    });

    const deleteSubMutation = useMutation({
        mutationFn: CategoryApi.deleteSubCategory,
        onSuccess: (res) => {
            SuccessToast(res.message);
            queryClient.invalidateQueries(["category"]);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Operation failed"),
    });

    return {
        categories,
        loading,
        addParentMutation,
        addSubMutation,
        updateParentMutation,
        updateSubMutation,
        deleteParentMutation,
        deleteSubMutation,
    };
};

export default useCategoriesManager;
