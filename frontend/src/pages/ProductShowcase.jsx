import { useEffect, useState } from "react";
import {
    Star,
    Heart,
    Share2,
    ShoppingCart,
    Zap,
    Shield,
    Truck,
    RotateCcw,
    ChevronDown,
    ChevronUp,
    Check,
    X,
    Plus,
    Minus,
    ChevronRight,
    Award,
    Package,
    Tag,
    BarChart2,
    Info,
    ThumbsUp,
    ThumbsDown,
    Eye,
    Menu,
} from "lucide-react";
import { Button, Container } from "../components/common";
import { useParams } from "react-router";
import { ProductApi } from "../apis";
import toast from "react-hot-toast";
import Loader from "../components/loadings/Loader";
import RenderStars from "../components/features/base-star/RenderStars";
import { tabs } from "../utils/constants";
import { getFormatedStr } from "../utils/helpers";
import ProductAttributes from "../components/features/products/product-showcase/ProductAttributes";
import TabVendor from "../components/features/products/product-showcase/TabVendor";
import { useReviews } from "../hooks";
import TabReviews from "../components/features/products/product-showcase/TabReviews";
import TabDescription from "../components/features/products/product-showcase/TabDescription";

export default function ProductPage() {
    const { slug } = useParams();
    const { reviews } = useReviews(slug);
    const [activeImage, setActiveImage] = useState(0);
    const [attributes, setAttributes] = useState(null);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState("Description");
    const [prosOpen, setProsOpen] = useState(true);
    const [consOpen, setConsOpen] = useState(true);
    const [product, setProduct] = useState(null);

    console.log(reviews);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await ProductApi.getSpecific(slug);

                if (res?.data?.success) {
                    setProduct(res.data.data);
                    setAttributes(
                        res.data.data.attributes.reduce((acc, attr) => {
                            acc[attr.name] = 0;
                            return acc;
                        }, {}),
                    );
                }
            } catch (err) {
                toast.error(err?.response?.data?.message || "Something went wrong", {
                    position: "right-top",
                });
            }
        };

        fetchProduct();
    }, [slug]);

    if (!product || !reviews) return <Loader />;

    return (
        <div className="min-h-screen  font-inter">
            <Container className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
                <div className="w-full max-w-100 shrink-0 lg:sticky lg:top-20 lg:self-start">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-base relative aspect-square flex items-center justify-center w-full">
                        <img
                            src={product.images[activeImage]?.thumbnailUrl}
                            alt="product"
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2.5 mt-3">
                        {product.images.map((img, i) => (
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

                <div className="flex-1 min-w-0">
                    {/* Brand + Category */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[11px] font-extrabold px-2.5 py-1 bg-green rounded-md tracking-widest text-amber-200">
                            {product.brandName.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Tag size={11} />{" "}
                            {`${getFormatedStr(product.category.name)} > ${getFormatedStr(product.category.parentCategory.name)}`}
                        </span>
                    </div>

                    {/* Product Name */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight mb-3">
                        {product.name}
                    </h1>

                    {/* Rating Row */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <RenderStars avgRating={product.avgRating} size={10} />
                        <span className="text-green-700 text-xs font-semibold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                            {product.stockQuantity} in stock
                        </span>
                    </div>

                    {/* Price Block */}
                    <div className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-green">
                        <div>
                            <span className="text-3xl sm:text-4xl font-black tracking-tight text-amber-200">
                                {product.currency}
                                {product.price.toLocaleString()}
                            </span>
                        </div>
                        <div className="sm:text-right">
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
                        setAttribute={setAttributes}
                        productAttributes={product.attributes}
                    />

                    {/* Divider */}
                    <div className="h-px bg-stone-200 mb-6" />

                    {/* Quantity + CTA Buttons */}
                    <div className="flex flex-wrap gap-3 items-center mb-7">
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
                                onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))}
                                className="w-11 h-12 flex items-center justify-center text-slate-600 hover:bg-stone-100 transition-colors border-0 bg-transparent cursor-pointer rounded-none"
                            >
                                <Plus size={15} />
                            </Button>
                        </div>

                        {/* Add to Cart */}
                        <Button className="flex-1 sm:flex-none h-12 px-5 bg-white border-2 border-green rounded-xl font-bold text-sm text-slate-900 cursor-pointer flex items-center justify-center gap-2 hover:bg-green hover:text-white transition-all duration-200 min-w-32.5">
                            <ShoppingCart size={16} /> Add to Cart
                        </Button>

                        {/* Buy Now */}
                        <Button className="flex-1 h-12 px-5 rounded-xl font-bold text-sm cursor-pointer flex items-center justify-center gap-2 text-amber-200 transition-all duration-200 hover:opacity-90 shadow-lg min-w-32.5 bg-green">
                            <Zap size={16} fill="#f0c040" /> Buy Now
                        </Button>

                        {/* Share */}
                        <Button
                            className="w-12 h-12 bg-white border border-stone-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors"
                            onClick={() => {
                                navigator.clipboard
                                    .writeText("http://localhost:5173/product/" + slug)
                                    .then(() => {
                                        toast.success("Product link copied to clipboard!", {
                                            position: "right-top",
                                        });
                                    });
                            }}
                        >
                            <Share2 size={16} className="text-slate-500" />
                        </Button>
                    </div>

                    {/* ── TABS ── */}
                    <div className="flex border-y-2 border-stone-200 mb-7 justify-center">
                        {tabs.map((t) => (
                            <Button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`px-4 sm:px-6 py-2.5 font-bold text-sm whitespace-nowrap cursor-pointer bg-transparent border-b-2 border-b-transparent rounded-none transition-all duration-200 -mb-0.5 ${
                                    activeTab === t
                                        ? "text-slate-900 border-b-2 border-amber-400"
                                        : "text-slate-400 hover:text-slate-700"
                                }`}
                            >
                                {t}
                            </Button>
                        ))}
                    </div>

                    {activeTab === "Description" && (
                        <TabDescription
                            description={product.description}
                            keyFeatures={product.keyFeatures}
                            pros={product.pros}
                            cons={product.cons}
                            prosOpen={prosOpen}
                            consOpen={consOpen}
                            setConsOpen={setConsOpen}
                            setProsOpen={setProsOpen}
                        />
                    )}

                    {activeTab === "Vendor" && <TabVendor {...product.vendor} />}

                    {activeTab === "Reviews" && <TabReviews reviews={reviews?.data} slug={slug} />}

                    <div className="mt-7 pt-5 border-t-2 border-stone-200 flex flex-wrap gap-4">
                        {[
                            {
                                icon: <Tag size={12} />,
                                label: "Category",
                                value: `${getFormatedStr(product.category.name)} > ${getFormatedStr(product.category.parentCategory.name)}`,
                            },
                            { icon: <Info size={12} />, label: "Slug", value: product.slug },
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

{
    /* Rating Summary */
}
// <div className="bg-white rounded-2xl p-5 sm:p-6 mb-5 border border-stone-200 shadow-base flex flex-col sm:flex-row gap-6 items-center">
//     <div className="text-center shrink-0">
//         <p className="text-6xl font-black text-slate-900 leading-none">
//             {product.rating}
//         </p>
//         <div className="flex justify-center mt-2">
//             <RenderStars avgRating={product.rating} size={10} />
//         </div>
//         <p className="text-xs text-slate-400 mt-1.5">Reviews</p>
//     </div>
//     {/* <div className="flex-1 w-full">
//         {[5, 4, 3, 2, 1].map((star) => {
//             const pct =
//                 star === 5
//                     ? 62
//                     : star === 4
//                       ? 24
//                       : star === 3
//                         ? 9
//                         : star === 2
//                           ? 3
//                           : 2;
//             return (
//                 <div
//                     key={star}
//                     className="flex items-center gap-2.5 mb-2"
//                 >
//                     <span className="text-xs text-slate-400 w-2.5">
//                         {star}
//                     </span>
//                     <Star size={11} fill="#f0c040" color="#f0c040" />
//                     <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
//                         <div
//                             className="h-full rounded-full bg-amber-400"
//                             style={{ width: `${pct}%` }}
//                         />
//                     </div>
//                     <span className="text-xs text-slate-400 w-7 text-right">
//                         {pct}%
//                     </span>
//                 </div>
//             );
//         })}
//     </div> */}
// </div>
