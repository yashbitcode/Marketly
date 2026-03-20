import { useCallback } from "react";
import { Container, Input, Button } from "../../common";
import { X, UploadCloud, Image as ImageIcon, ChevronRight, Package } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductClient } from "../../../../../shared/validations/product.validations";
import ProductEssentials from "../products/vendor-product/ProductEssentials";
import BasicInfo from "../products/vendor-product/BasicInfo";
import PricingInfo from "../products/vendor-product/PricingInfo";
import ProductAttributes from "../products/vendor-product/ProductAttributes";
import { Link } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { useAuth, useCategories } from "../../../hooks";
import Loader from "../../loadings/Loader";
import { useMutation } from "@tanstack/react-query";
import { useImageKitUpload } from "../../../hooks";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";
import { ProductApi } from "../../../apis";

const ProductCU = () => {
    const { categories, loading } = useCategories();
    const { handleUpload } = useImageKitUpload();
    const {user} = useAuth();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm({
        
        resolver: zodResolver(addProductClient),
    });

    const mutation = useMutation({
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

            console.log("DSSDSD: ", {
                name,
                brandName,
                price,
                keyFeatures,
                stockQuantity,
                category: categories?.subCategories?.find((el) => el.name === category)?._id,
                description,
                pros,
                files,
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
            })

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

            console.log("FILES: ", files);
            console.log(payload)

            if (files && files?.length !== 0) {
                const uploadPromises = await handleUpload(
                    files,
                    { user: user._id },
                    "/products",
                );

                const attachmentsData = await Promise.all(uploadPromises);
                payload.images = attachmentsData;
            }

            const res = await ProductApi.addProduct(payload);
            
            return res;
        },
        onSuccess: (res) => {
            SuccessToast(res?.message);
        },
        onError: (e) => {
            ErrorToast(e.response.data.message)
        }
    });

    const files = useWatch({
        control,
        name: "files",
    });

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
        // console.log(data);
        mutation.mutate(data)
    };

    // console.log(errors);

    if (loading) return <Loader />;

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
                                {Array.from(files || [])?.map((imgFile, idx) => (
                                    <div
                                        key={imgFile.name}
                                        className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden group max-w-100"
                                    >
                                        <div className="w-full">
                                            <img
                                                src={URL.createObjectURL(imgFile)}
                                                alt={imgFile.name}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => handleRemoveImg(idx)}
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
