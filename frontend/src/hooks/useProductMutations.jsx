import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useImageKitUpload from "./useImageKitUpload";
import { ProductApi } from "../apis";
import { MediaApi } from "../apis";
import useAuth from "./useAuth";
import { ErrorToast, SuccessToast } from "../utils/toasts";

const useProductMutations = (categories, setDeleteImages, slug, setError, product, existingImages, deleteImages, allImages) => {
    const navigate = useNavigate();
     const { handleUpload } = useImageKitUpload();
     const {user} = useAuth();

    const addProductMutation = useMutation({
        mutationFn: async (data) => {
            const {
                name,
                brandName,
                price,
                stockQuantity,
                category,
                keyFeatures,
                description,
                attributes,
                files,
                pros,
                cons,
            } = data;

            const payload = {
                name,
                brandName,
                price,
                keyFeatures,
                stockQuantity,
                category: categories?.subCategories?.find((el) => el.name === category)?._id,
                description,
                pros,
                cons,
                attributes: attributes?.map((el) => {
                    let { name, value, dataType, isVariant } = el;

                    if (isVariant)
                        value = value.split(",").map((el) => {
                            if (dataType === "number") return Number(el);
                            return el.trim();
                        });
                    else if (dataType === "number") value = Number(value);

                    return { name, value, dataType, isVariant };
                }),
            };

            if (files && files?.length !== 0) {
                const uploadPromises = await handleUpload(files, { user: user._id }, "/products");

                const attachmentsData = await Promise.all(uploadPromises);
                payload.images = attachmentsData;
            }

            const res = await ProductApi.addProduct(payload);

            return res;
        },
        onSuccess: (res) => {
            SuccessToast(res?.message);
            navigate("/vendor/products");
        },
        onError: (e) => ErrorToast(e.response.data.message),
    });

    const updateProductMutation = useMutation({
        mutationFn: async (data) => {
            const {
                name,
                brandName,
                price,
                stockQuantity,
                category,
                keyFeatures,
                description,
                attributes,
                files,
                pros,
                cons,
            } = data;

            if (allImages && allImages.length === 0) {
                setError("files", {
                    message: "Atleast 1 image should be there",
                });
                return;
            }
            if ((allImages.length || 0) > 4) {
                setError("files", {
                    message: "Maximum 4 images are allowed",
                });
                return;
            }

            const resolvedCategoryId = categories?.subCategories?.find(
                (el) => el.name === category,
            )?._id;

            const processedAttributes = attributes?.map((el) => {
                let { name, value, dataType, isVariant } = el;

                if (isVariant)
                    value = value.split(",").map((el) => {
                        if (dataType === "number") return Number(el);
                        return el.trim();
                    });
                else if (dataType === "number") value = Number(value);

                return { name, value, dataType, isVariant };
            });

            // Build a payload with only the fields that differ from the stored product
            const payload = {};

            if (name !== product?.name) payload.name = name;
            if (brandName !== product?.brandName) payload.brandName = brandName;
            if (price !== product?.price) payload.price = price;
            if (stockQuantity !== product?.stockQuantity) payload.stockQuantity = stockQuantity;
            if (description !== product?.description) payload.description = description;
            if (resolvedCategoryId !== product?.category?._id)
                payload.category = resolvedCategoryId;
            if (JSON.stringify(keyFeatures) !== JSON.stringify(product?.keyFeatures))
                payload.keyFeatures = keyFeatures;
            if (JSON.stringify(pros) !== JSON.stringify(product?.pros)) payload.pros = pros;
            if (JSON.stringify(cons) !== JSON.stringify(product?.cons)) payload.cons = cons;
            if (
                JSON.stringify(processedAttributes) !==
                JSON.stringify(
                    product?.attributes?.map((el) => ({
                        ...el,
                        value: Array.isArray(el.value) ? el.value : el.value,
                    })),
                )
            )
                payload.attributes = processedAttributes;

            console.log(payload);

            if (deleteImages.length > 0) {
                const deleteRes = await MediaApi.deleteImages(deleteImages, "/products");
                if (!deleteRes.success) {
                    ErrorToast(deleteRes.message);
                    return;
                }
            }

            let attachmentsData = [];
            if (files && files?.length !== 0) {
                const uploadPromises = await handleUpload(files, { user: user._id }, "/products");

                attachmentsData = await Promise.all(uploadPromises);
            }

            payload.images = [
                ...attachmentsData,
                ...(existingImages
                    ? existingImages.filter((el) => !deleteImages.includes(el.fileId))
                    : []),
            ];

            setDeleteImages([]);

            const res = await ProductApi.updateProduct(slug, payload);

            console.log(res);

            return res;
        },
        onSuccess: (res) => {
            SuccessToast(res?.message);
            navigate("/vendor/products");
        },
        onError: (e) => ErrorToast(e?.response?.data?.message || e?.message),
    });

    const updateProductStatusMutation = useMutation({
        mutationFn: async ({ slug, payload }) => {
            const res = await ProductApi.updateStatus(slug, payload);
            return res;
        },
        onSuccess: (res) => {
            SuccessToast(res?.message || "Product status updated");
        },
        onError: (e) => ErrorToast(e?.response?.data?.message || e?.message),
    });

    return { addProductMutation, updateProductMutation, updateProductStatusMutation };
};

export default useProductMutations;