import { BarChart2, Check, ChevronDown, ChevronUp, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Button } from "../../../common";
import { memo } from "react";

const TabDescription = ({
    description,
    keyFeatures,
    pros,
    cons,
    prosOpen,
    consOpen,
    handleSetConsOpen,
    handleSetProsOpen,
}) => {
    return (
        <div>
            <p className="text-sm sm:text-[15px] leading-relaxed text-slate-500 mb-7">
                {description}
            </p>

            {/* Key Features */}
            <div className="mb-7">
                <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart2 size={17} className="text-amber-400" /> Key Features
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                    {keyFeatures.map((feat, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3 bg-white rounded-xl p-3.5 shadow-base border border-stone-100"
                        >
                            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#1a1a2e] shrink-0 mt-0.5">
                                <Check size={10} color="#f0c040" />
                            </div>
                            <span className="text-sm text-slate-700 font-medium leading-snug">
                                {feat}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pros */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-3">
                <Button
                    onClick={handleSetProsOpen}
                    className="w-full flex items-center justify-between bg-transparent border-0 cursor-pointer p-0"
                >
                    <span className="font-extrabold text-sm text-green-700 flex items-center gap-2">
                        <ThumbsUp size={15} className="text-green-700" /> Pros
                    </span>
                    {prosOpen ? (
                        <ChevronUp size={15} className="text-green-700" />
                    ) : (
                        <ChevronDown size={15} className="text-green-700" />
                    )}
                </Button>
                {prosOpen && (
                    <ul className="mt-3 space-y-2 list-none p-0 m-0">
                        {pros.map((pro, idx) => (
                            <li
                                key={idx}
                                className="flex items-center gap-2.5 text-sm text-green-700"
                            >
                                <Check size={13} className="shrink-0" /> {pro}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Cons */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-7">
                <Button
                    onClick={handleSetConsOpen}
                    className="w-full flex items-center justify-between bg-transparent border-0 cursor-pointer p-0"
                >
                    <span className="font-extrabold text-sm text-orange-800 flex items-center gap-2">
                        <ThumbsDown size={15} className="text-orange-800" /> Cons
                    </span>
                    {consOpen ? (
                        <ChevronUp size={15} className="text-orange-800" />
                    ) : (
                        <ChevronDown size={15} className="text-orange-800" />
                    )}
                </Button>
                {consOpen && (
                    <ul className="mt-3 space-y-2 list-none p-0 m-0">
                        {cons.map((con, idx) => (
                            <li
                                key={idx}
                                className="flex items-center gap-2.5 text-sm text-orange-800"
                            >
                                <X size={13} className="shrink-0" /> {con}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default memo(TabDescription);
