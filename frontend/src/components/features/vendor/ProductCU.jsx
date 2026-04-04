import { useCallback, useEffect, useMemo, useState } from "react";
import { Container, Input, Button, Error } from "../../common";
import { X, UploadCloud, Image as ImageIcon, ChevronRight, Package } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    addProductClient,
    updateProductClient,
} from "../../../../../shared/validations/product.validations";
import ProductEssentials from "../products/vendor-product/ProductEssentials";
import BasicInfo from "../products/vendor-product/BasicInfo";
import PricingInfo from "../products/vendor-product/PricingInfo";
import ProductAttributes from "../products/vendor-product/ProductAttributes";
import { Link } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { useCategories, useProduct, useProductMutations } from "../../../hooks";
import Loader from "../../loadings/Loader";
import { ErrorToast } from "../../../utils/toasts";
import { useParams } from "react-router";

const ProductCU = () => {
    const { slug } = useParams();
    const { categories, loading } = useCategories();
    const [deleteImages, setDeleteImages] = useState([]);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(slug ? updateProductClient : addProductClient),
    });

    const {files, attributes}= useWatch({
        control,
        name: ["files", "attributes"],
    });

    console.log(attributes)
    console.log(errors)

    const {
        product: { data: product } = {},
        loading: productLoading,
        isError,
        error,
    } = useProduct(slug);

    const existingImages = useMemo(() => product?.images ?? null, [product]);

    useEffect(() => {
        if (!product) return;

        reset({
            name: product.name,
            brandName: product.brandName,
            price: product.price,
            stockQuantity: product.stockQuantity,
            category: product.category?.name,
            keyFeatures: product.keyFeatures,
            description: product.description,
            attributes:
                product.attributes?.length > 0
                    ? product.attributes.map((el) => ({ ...el, value: el.isVariant ? el.value?.join(",") : el.value.toString() }))
                    : undefined,
            pros: product.pros,
            cons: product.cons,
        });
    }, [product, reset, setError]);

    const allImages = [
        ...Array.from(files || []),
        ...(existingImages ? existingImages.filter((el) => !deleteImages.includes(el.fileId)) : []),
    ];

    const {addProductMutation, updateProductMutation} = useProductMutations(categories, setDeleteImages, slug, setError, product, existingImages, deleteImages, allImages);

    const handleRemoveImg = useCallback(
        (idx) => {
            const dt = new DataTransfer();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (idx !== i) dt.items.add(file);
            }

            setValue("files", dt.files, { shouldValidate: true });
        },
        [files, setValue],
    );

    const onSubmit = (data) => {
        if (slug) updateProductMutation.mutate(data);
        else addProductMutation.mutate(data);
    };

    useEffect(() => {
        if (isError) ErrorToast(error);
    }, [isError, error]);

    if (loading || (slug && productLoading)) return <Loader />;
    if (isError || error) return <Error error={error} />;

    return (
        <div className="min-h-screen bg-slate-50 font-inter w-full py-8 px-4 sm:px-6 lg:px-8">
            <Container className="max-w-5xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Package className="w-8 h-8 text-orange" />
                        Add New Product
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm max-w-2xl">
                        Fill in the details below to list a new product in your store. Ensure all
                        required fields are provided accurately for best visibility.
                    </p>
                </div>

                <form
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info Section */}
                        <BasicInfo
                            watch={watch}
                            setValue={setValue}
                            register={register}
                            categories={categories?.subCategories?.map((el) => el.name)}
                            errors={errors}
                        />

                        {/* Pricing and Inventory */}
                        <PricingInfo register={register} errors={errors} />

                        <ProductEssentials register={register} control={control} errors={errors} />

                        {/* Product Attributes */}
                        <ProductAttributes
                            register={register}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                            control={control}
                        />
                    </div>

                    {/* Right Column - Media & Actions */}
                    <div className="space-y-6">
                        {/* Media Upload */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-slate-400" />
                                Product Images
                            </h2>
                            <label
                                htmlFor="product-images-upload"
                                className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-orange transition-colors cursor-pointer group"
                            >
                                <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-8 h-8 text-orange" />
                                </div>
                                <p className="text-slate-700 font-medium mb-1">
                                    Click to upload images
                                </p>
                                <p className="text-xs text-slate-500">
                                    SVG, PNG, JPG or GIF (max. 800x400px)
                                </p>
                                <Input
                                    id="product-images-upload"
                                    type="file"
                                    multiple
                                    accept="image/jpeg, image/jpg, image/webp, image/png"
                                    {...register("files")}
                                    error={errors?.files?.message}
                                    className="hidden"
                                />
                            </label>

                            {/* Dummy Image Preview Area */}
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {allImages?.map((imgFile, idx) => (
                                    <div
                                        key={imgFile.fileId || imgFile.name}
                                        className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden group max-w-100"
                                    >
                                        <div className="w-full">
                                            <img
                                                src={
                                                    imgFile.fileId
                                                        ? imgFile.url
                                                        : URL.createObjectURL(imgFile)
                                                }
                                                alt={
                                                    imgFile.fileId ? imgFile.filename : imgFile.name
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                imgFile.fileId
                                                    ? setDeleteImages((prev) => [
                                                          ...prev,
                                                          imgFile.fileId,
                                                      ])
                                                    : handleRemoveImg(idx)
                                            }
                                            className="absolute rounded-none inset-0 bg-black/40 hidden group-hover:flex items-center justify-center p-0  transition-all opacity-0 group-hover:opacity-100"
                                            title="Remove image"
                                        >
                                            <X className="text-white w-5 h-5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 sticky top-6">
                            <div className="space-y-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-orange hover:bg-orange/90 text-white font-medium py-3 rounded-xl shadow-lg shadow-orange/20 flex items-center justify-center gap-2"
                                >
                                    Publish Product <ChevronRight size={18} />
                                </Button>
                            </div>
                            <p className="text-xs text-center text-slate-400 mt-4">
                                By publishing, you agree to our{" "}
                                <Link to="#" className="underline">
                                    Vendor Terms
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </Container>
        </div>
    );
};

export default ProductCU;
