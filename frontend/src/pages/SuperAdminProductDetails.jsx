import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Container, Button, Error, Textarea } from "../components/common";
import Loader from "../components/loadings/Loader";
import { useProduct, useProductMutations } from "../hooks";
import { ChevronLeft, CheckCircle, XCircle, Power, Info, Tag, User as UserIcon } from "lucide-react";

import { useForm, useWatch } from "react-hook-form";
import { updateProductStatusValidations } from "../../../shared/validations/product.validations";
import { zodResolver } from "@hookform/resolvers/zod";

const SuperAdminProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { product, loading, isError, error } = useProduct(slug);
    const { updateProductStatusMutation } = useProductMutations();
    const [activeImage, setActiveImage] = useState(0);

    const { register, handleSubmit, setValue, reset, control, formState: {errors} } = useForm({
        defaultValues: {
            status: "pending",
            isActive: false,
            remarks: ""
        },
        resolver: zodResolver(updateProductStatusValidations)
    });

    const [status, isActive] = useWatch({
        control,
        name: ["status", "isActive"]
    })

    useEffect(() => {
        if (product?.data) {
            reset({
                status: product.data.approval?.status || "pending",
                isActive: !!product.data.isActive,
                remarks: product.data.approval?.remarks || ""
            });
        }
    }, [product, reset]);

    if (loading) return <Loader />;
    if (isError) return <Error error={error || "Something went wrong"} />;

    const handleUpdate = (data) => {
        updateProductStatusMutation.mutate({
            slug,
            payload: data
        });
    };

    console.log(errors)

    const p = product.data;

    return (
        <div className="min-h-screen bg-gray-50/50 font-inter pb-12">
            <Container className="max-w-6xl mx-auto px-4 py-8">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Product Review</h1>
                        <p className="text-sm text-gray-500">Manage product approval and visibility</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Product Visuals & Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Image Gallery */}
                                <div>
                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100 mb-4">
                                        <img 
                                            src={p.images[activeImage]?.url} 
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {p.images.map((img, i) => (
                                            <Button 
                                                key={i}
                                                onClick={() => setActiveImage(i)}
                                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === i ? "border-orange" : "border-transparent opacity-60 hover:opacity-100"}`}
                                            >
                                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Core Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded tracking-wider">
                                            {p.brandName}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            Slug: {p.slug}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{p.name}</h2>
                                    {/* <div className="flex items-center gap-3">
                                        <RenderStars avgRating={p.avgRating} size={14} />
                                        <span className="text-sm text-gray-500">({p.reviewsCount || 0} reviews)</span>
                                    </div> */}
                                    <div className="text-3xl font-black text-orange">
                                        {p.currency}{p.price.toLocaleString()}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Tag size={16} className="text-gray-400" />
                                            <span>{p.category?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <UserIcon size={16} className="text-gray-400" />
                                            <span>Vendor: <span className="font-medium text-gray-900">{p.vendor?.storeName}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Info size={16} className="text-gray-400" />
                                            <span>Stock: <span className="font-medium text-gray-900">{p.stockQuantity} units</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 border-t border-gray-100 pt-8">
                                <h3 className="font-bold text-gray-900 mb-4">Description</h3>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{p.description}</p>
                            </div>

                            {p.attributes?.length > 0 && (
                                <div className="mt-8 border-t border-gray-100 pt-8">
                                    <h3 className="font-bold text-gray-900 mb-4">Attributes</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {p.attributes.map((attr, i) => (
                                            <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{attr.name}</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {Array.isArray(attr.value) ? attr.value.join(", ") : attr.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Admin Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                Admin Controls
                            </h3>

                            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
                                {/* Approval Status */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Approval Status</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: "pending", label: "Pending", icon: Info, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
                                            { id: "accepted", label: "Accepted", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
                                            { id: "rejected", label: "Rejected", icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
                                        ].map((opt) => (
                                            <Button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setValue("status", opt.id)}
                                                className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                                                    status === opt.id 
                                                    ? `${opt.bg} ${opt.border} ${opt.color} ring-2 ring-orange/5` 
                                                    : "bg-white border-gray-100 text-gray-400 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                                                }`}
                                            >
                                                <span className="font-medium">{opt.label}</span>
                                                <opt.icon size={18} />
                                            </Button>
                                        ))}
                                         {errors?.status && <span className="text-red-500 text-[0.8rem] -mt-1">{errors?.status?.message}</span>}
                                    </div>
                                </div>

                                {/* Is Active Toggle */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Active Status</label>
                                    <Button
                                        type="button"
                                        onClick={() => setValue("isActive", !isActive)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                                            isActive 
                                            ? "bg-blue-50 border-blue-200 text-blue-600" 
                                            : "bg-gray-50 border-gray-200 text-gray-400"
                                        }`}
                                    >
                                        <span className="font-medium">{isActive ? "Active on Platform" : "Inactive / Hidden"}</span>
                                        <Power size={18} />
                                    </Button>
                                    {errors?.isActive && <span className="text-red-500 text-[0.8rem] -mt-1">{errors?.isActive?.message}</span>}
                                </div>

                                
                                    <Textarea
                                        {...register("remarks")}
                                        label={"Remarks"}
                                        error={errors?.remarks?.message}
                                        placeholder="Add notes for the vendor..."
                                        className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-orange/10 focus:border-orange transition-all resize-none"
                                    />

                                <Button
                                    type="submit"
                                    isLoading={updateProductStatusMutation.isPending}
                                    className="w-full h-14 bg-orange hover:bg-orange/90 text-white font-bold rounded-xl shadow-lg shadow-orange/20 transition-all flex items-center justify-center gap-2"
                                >
                                    Update Product
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default SuperAdminProductDetails;
