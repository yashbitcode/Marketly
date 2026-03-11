import { useCallback, useEffect, useState } from "react";
import { Share2, ShoppingCart, Zap, Plus, Minus, Tag, Info } from "lucide-react";
import { Button, Container } from "../components/common";
import { useParams } from "react-router";
import { ProductApi } from "../apis";
import Loader from "../components/loadings/Loader";
import RenderStars from "../components/features/base-star/RenderStars";
import { tabs } from "../utils/constants";
import { getFormatedStr } from "../utils/helpers";
import ProductAttributes from "../components/features/products/product-showcase/ProductAttributes";
import TabVendor from "../components/features/products/product-showcase/TabVendor";
import { useReviews } from "../hooks";
import TabReviews from "../components/features/products/product-showcase/TabReviews";
import TabDescription from "../components/features/products/product-showcase/TabDescription";
import { useQuery } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "../utils/toasts";

export default function ProductPage() {
    const { slug } = useParams();
    const { reviews, loading: reviewLoading } = useReviews(slug);
    const [activeImage, setActiveImage] = useState(0);
    const [attributes, setAttributes] = useState(null);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState("Description");
    const [prosOpen, setProsOpen] = useState(true);
    const [consOpen, setConsOpen] = useState(true);

    const {
        isPending,
        isError,
        error,
        data: product,
    } = useQuery({
        queryKey: ["specific-product", slug],
        queryFn: () => ProductApi.getSpecific(slug),
    });

    const handleSetProsOpen = useCallback((value) => {
        setProsOpen(value);
    }, []);

    const handleSetConsOpen = useCallback((value) => {
        setConsOpen(value);
    }, []);

    const handleSetAttributes = useCallback((name, value) => {
        setAttributes((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    useEffect(() => {
        const setInitialAttributes = async () => {
            console.log(product.data.attributes);
            setAttributes(
                product.data.attributes.reduce((acc, attr) => {
                    acc[attr.name] = 0;
                    return acc;
                }, {}),
            );
        };
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong");
        else if (product) setInitialAttributes();
    }, [slug, error, isError, product]);

    if (isPending || reviewLoading) return <Loader />;

    return (
        <div className="min-h-screen font-inter">
            <Container className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
                <div className="w-full max-w-100 shrink-0 lg:sticky lg:top-20 lg:self-start mx-auto">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-base relative aspect-square flex items-center justify-center w-full">
                        <img
                            src={product.data.images[activeImage]?.thumbnailUrl}
                            alt="product"
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2.5 mt-3">
                        {product.data.images.map((img, i) => (
                            <Button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`flex-1 aspect-square rounded-xl overflow-hidden cursor-pointer p-0 border-0 bg-transparent transition-all duration-200 ${
                                    activeImage === i
                                        ? "ring-2 ring-slate-500 ring-offset-[0.5px]"
                                        : "opacity-55 hover:opacity-90"
                                }`}
                            >
                                <img
                                    src={img.url}
                                    alt="img"
                                    className="w-full h-full object-cover"
                                />
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 min-w-0 mx-auto">
                    {/* Brand + Category */}
                    <div className="flex flex-wrap items-center gap-2 mb-2 max-lg:justify-center">
                        <span className="text-[11px] font-extrabold px-2.5 py-1 bg-green rounded-md tracking-widest text-amber-200">
                            {product.data.brandName.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Tag size={11} />{" "}
                            {`${getFormatedStr(product.data.category.name)} > ${getFormatedStr(product.data.category.parentCategory.name)}`}
                        </span>
                    </div>

                    {/* Product Name */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight mb-3 max-lg:text-center">
                        {product.data.name}
                    </h1>

                    {/* Rating Row */}
                    <div className="flex flex-wrap items-center max-lg:justify-center gap-3 mb-5 ">
                        <RenderStars avgRating={product.data.avgRating} size={10} />
                        <span className="text-green-700 font-semibold bg-green-50 px-2.5 py-1 rounded-full border text-xs mt-1 border-green-200">
                            {product.data.stockQuantity} in stock
                        </span>
                    </div>

                    {/* Price Block */}
                    <div className="rounded-2xl p-5 mb-6 flex flex-col min-[380px]:flex-row sm:items-center justify-between max-[380x]:justify-center gap-3 bg-green ">
                        <div className="max-[380px]:text-center">
                            <span className="text-3xl sm:text-4xl font-black tracking-tight text-amber-200">
                                {product.data.currency}
                                {product.data.price.toLocaleString()}
                            </span>
                        </div>
                        <div className="max-[380px]:text-center">
                            <p className="text-white text-[10px] uppercase tracking-wider mb-1.5">
                                Inclusive of all taxes
                            </p>
                            <span className="bg-amber-200 text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg">
                                LIMITED OFFER
                            </span>
                        </div>
                    </div>

                    <ProductAttributes
                        attributes={attributes}
                        handleSetAttributes={handleSetAttributes}
                        productAttributes={product.data.attributes}
                    />

                    {/* Divider */}
                    <div className="h-px bg-stone-200 mb-6" />

                    {/* Quantity + CTA Buttons */}
                    <div className="flex flex-wrap gap-3 items-center mb-7 max-md:flex-col">
                        {/* Qty Stepper */}
                        <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
                            <Button
                                onClick={() => setQty(Math.max(1, qty - 1))}
                                className="w-11 h-12 flex items-center justify-center text-slate-600 hover:bg-stone-100 transition-colors border-0 bg-transparent cursor-pointer rounded-none"
                            >
                                <Minus size={15} />
                            </Button>
                            <span className="w-10 text-center font-bold text-base text-slate-900 select-none">
                                {qty}
                            </span>
                            <Button
                                onClick={() =>
                                    setQty(Math.min(product.data.stockQuantity, qty + 1))
                                }
                                className="w-11 h-12 flex items-center justify-center text-slate-600 hover:bg-stone-100 transition-colors border-0 bg-transparent cursor-pointer rounded-none"
                            >
                                <Plus size={15} />
                            </Button>
                        </div>

                        <div className={"flex gap-4 max-md:w-full max-[350px]:flex-col"}>
                            <Button className="flex-1 md:flex-none h-12 px-5 bg-white border-2 border-green rounded-xl font-bold  text-slate-900 cursor-pointer flex items-center justify-center gap-2 hover:bg-green hover:text-white transition-all duration-200 min-w-32.5">
                                <ShoppingCart size={16} /> Add to Cart
                            </Button>

                            {/* Buy Now */}
                            <Button className="flex-1 h-12 px-5 rounded-xl font-bold cursor-pointer flex items-center justify-center gap-2 text-amber-200 transition-all duration-200 hover:opacity-90 shadow-lg min-w-32.5 bg-green border-2 border-green">
                                <Zap size={16} fill="#f0c040" /> Buy Now
                            </Button>
                        </div>

                        {/* Share */}
                        <Button
                            className="w-12 h-12 bg-white border border-stone-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors"
                            onClick={() => {
                                navigator.clipboard
                                    .writeText("http://localhost:5173/product/" + slug)
                                    .then(() => SuccessToast("Product link copied to clipboard!"));
                            }}
                        >
                            <Share2 size={16} className="text-slate-500" />
                        </Button>
                    </div>

                    <div className="flex border-y-2 border-stone-200 mb-7 justify-center">
                        {tabs.map((tab) => (
                            <Button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 sm:px-6 py-2.5 font-bold text-sm whitespace-nowrap cursor-pointer bg-transparent border-b-2 border-b-transparent rounded-none transition-all duration-200 -mb-0.5 ${
                                    activeTab === tab
                                        ? "text-slate-900 border-b-2 border-amber-400"
                                        : "text-slate-400 hover:text-slate-700"
                                }`}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>

                    {activeTab === "Description" && (
                        <TabDescription
                            description={product.data.description}
                            keyFeatures={product.data.keyFeatures}
                            pros={product.data.pros}
                            cons={product.data.cons}
                            prosOpen={prosOpen}
                            consOpen={consOpen}
                            setConsOpen={handleSetConsOpen}
                            setProsOpen={handleSetProsOpen}
                        />
                    )}

                    {activeTab === "Vendor" && <TabVendor {...product.data.vendor} />}

                    {activeTab === "Reviews" && <TabReviews reviews={reviews?.data} slug={slug} />}

                    <div className="mt-7 pt-5 border-t-2 border-stone-200 flex flex-wrap gap-4">
                        {[
                            {
                                icon: <Tag size={12} />,
                                label: "Category",
                                value: `${getFormatedStr(product.data.category.name)} > ${getFormatedStr(product.data.category.parentCategory.name)}`,
                            },
                            { icon: <Info size={12} />, label: "Slug", value: product.data.slug },
                        ].map((m, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1.5 text-xs text-slate-400"
                            >
                                <span>{m.icon}</span>
                                <span className="font-semibold text-slate-500">{m.label}:</span>
                                <span className="truncate max-w-35 sm:max-w-none">{m.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
