import { useState } from "react";
import { Button, Input } from "../../common";
import Star from "../base-star/Star";
import { ALL_CATEGORIES, ALL_SUB_CATEGORIES } from "../../../utils/dummy";
import { getFormatedStr } from "../../../utils/helpers";

const Section = ({ title, children }) => (
    <div className="flex flex-col gap-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {title}
        </span>
        {children}
    </div>
);

const Divider = () => <hr className="border-gray-100" />;

const ProductsFilter = ({
    categories = ALL_CATEGORIES,
    subCategories = ALL_SUB_CATEGORIES,
    onApply,
}) => {
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [brandSearch, setBrandSearch] = useState("");
    const [rating, setRating] = useState(0); 
    const [inStockOnly, setInStockOnly] = useState(false);

    const toggleTag = (value, list, setList) => {
        setList(
            list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
        );
    };

    const handleReset = () => {
        setMinPrice("");
        setMaxPrice("");
        setSelectedCategories([]);
        setSelectedSubCategories([]);
        setBrandSearch("");
        setRating(0);
        setInStockOnly(false);
    };

    const handleApply = () => {
        console.log({
            minPrice: minPrice === "" ? null : +minPrice,
            maxPrice: maxPrice === "" ? null : +maxPrice,
            categories: selectedCategories,
            subCategories: selectedSubCategories,
            brandName: brandSearch.trim(),
            rating,
            inStockOnly,
        })
        // onApply?.({
        //     minPrice: minPrice === "" ? null : +minPrice,
        //     maxPrice: maxPrice === "" ? null : +maxPrice,
        //     categories: selectedCategories,
        //     subCategories: selectedSubCategories,
        //     brandName: brandSearch.trim(),
        //     rating,
        //     inStockOnly,
        // });
    };

    const Tag = ({ label, active, onClick }) => (
        <Button
            onClick={onClick}
            className={`px-3 py-1 rounded-full text-xs font-medium border-2 transition-all whitespace-nowrap
        ${active
                    ? "bg-dark text-white border-dark"
                    : "border-gray-200 text-gray-600 hover:border-gray-400 bg-white"
                }`}
        >
            {label}
        </Button>
    );

    const RatingRow = ({ value }) => {
        const isActive = rating === value;
        return (
            <Button
                onClick={() => setRating(isActive ? 0 : value)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all w-fit bg-transparent
          ${isActive
                        ? "border-dark/50 bg-dark/5 shadow-sm"
                        : "border-transparent hover:border-gray-200"
                    }`}
            >
                <span className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                            key={s}
                            size={16}
                            fill={s <= value ? 100 : 0}
                        />
                    ))}
                </span>
                <span className="text-xs font-medium text-gray-500">
                    {value === 5 ? "Only" : "& up"}
                </span>
            </Button>
        );
    };

    return (
        <div className="w-75 bg-white rounded-base border-2 border-gray-100  flex flex-col overflow-hidden font-inter h-140 mx-4">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-gray-100">
                <h2 className="font-semibold text-sm text-gray-800 tracking-tight">Filters</h2>


                <Button onClick={handleReset} className="p-0 bg-transparent text-dark text-sm">Reset all</Button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex flex-col gap-5 px-5 py-5 overflow-y-auto max-h-[calc(100vh-10rem)] scrollbar-thin-custom">

                <Section title="Price Range">
                    <div className="flex flex-col items-center">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="text-sm py-1.5 no-spinner"
                        />
                        <span className="text-gray-300 font-light text-lg shrink-0">—</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="text-sm py-1.5 no-spinner"
                        />
                    </div>
                </Section>

                <Divider />

                {/* Categories */}
                <Section title="Categories">
                    <div className="flex flex-wrap gap-1.5">
                        {categories?.map((cat) => (
                            <Tag
                                key={cat.slug}
                                label={getFormatedStr(cat.name)}
                                active={selectedCategories.includes(cat.slug)}
                                onClick={() => toggleTag(cat.slug, selectedCategories, setSelectedCategories)}
                            />
                        ))}
                    </div>
                </Section>

                <Divider />

                {/* Sub-categories */}
                <Section title="Sub-categories">
                    <div className="flex flex-wrap gap-1.5">
                        {subCategories?.map((sub) => (
                            <Tag
                                key={sub.slug}
                                label={getFormatedStr(sub.name)}
                                active={selectedSubCategories.includes(sub.slug)}
                                onClick={() => toggleTag(sub.slug, selectedSubCategories, setSelectedSubCategories)}
                            />
                        ))}
                    </div>
                </Section>

                <Divider />

                {/* Brand search */}
                <Section title="Brand">
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                        </svg>
                        <Input
                            type="text"
                            placeholder="Search brand…"
                            value={brandSearch}
                            onChange={(e) => setBrandSearch(e.target.value)}
                            className="pl-8 text-sm py-1.5"
                        />
                        {brandSearch && (
                            <Button onClick={() => setBrandSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors bg-transparent p-0">

                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                                </svg>
                            </Button>
                        )}
                    </div>
                </Section>

                <Divider />

                {/* Rating */}
                <Section title="Customer Rating">
                    <div className="flex flex-col gap-0.5">
                        {[5, 4, 3, 2, 1].map((v) => (
                            <RatingRow key={v} value={v} />
                        ))}
                    </div>
                </Section>

                <Divider />

                {/* Stock */}
                <Section title="Availability">
                    <label className="flex items-center gap-3 cursor-pointer select-none group w-fit">
                        <div
                            onClick={() => setInStockOnly(!inStockOnly)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0
                ${inStockOnly
                                    ? "bg-dark border-dark"
                                    : "border-gray-300 group-hover:border-gray-500"
                                }`}
                        >
                            {inStockOnly && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <span
                            onClick={() => setInStockOnly(!inStockOnly)}
                            className="text-sm text-gray-700 font-medium"
                        >
                            In stock only
                        </span>
                    </label>
                </Section>
            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-4 border-t-2 border-gray-100 bg-gray-50/60">
                <Button
                    type="button"
                    variant="primary"
                    className="w-full justify-center py-2 text-sm font-semibold rounded-[7px]"
                    onClick={handleApply}
                >
                    Apply Filters
                </Button>
            </div>
        </div>
    );
};

export default ProductsFilter;