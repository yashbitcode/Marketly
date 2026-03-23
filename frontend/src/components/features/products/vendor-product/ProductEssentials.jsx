import { FileText, Plus, X } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { Button, Input } from "../../../common";

const ProductEssentials = ({ register, control, errors }) => {
    const {
        fields: keyFeatures,
        append: appendKF,
        remove: removeKF,
    } = useFieldArray({
        control,
        name: "keyFeatures",
    });
    const {
        fields: pros,
        append: appendPro,
        remove: removePro,
    } = useFieldArray({
        control,
        name: "pros",
    });
    const {
        fields: cons,
        append: appendCon,
        remove: removeCon,
    } = useFieldArray({
        control,
        name: "cons",
    });

    // useEffect(() => {
    //     if (keyFeatures.length === 0) appendKF("");
    //     if (cons.length === 0) appendCon("");
    //     if (pros.length === 0) appendPro("");
    // }, [appendCon, appendKF, appendPro, keyFeatures.length, cons.length, pros.length]);

    return (
        <div className="bg-white rounded-lg w-full p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Features & Details
            </h2>

            <div className="space-y-8 w-full">
                {/* Key Features */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-slate-700">Key Features</label>
                    </div>
                    <div className="space-y-3 w-full">
                        {keyFeatures.map((kf, idx) => (
                            <div key={kf.id} className="flex w-full items-center gap-3">
                                <Input
                                    className="w-full"
                                    placeholder="Add a key feature..."
                                    {...register(`keyFeatures.${idx}`)}
                                    error={errors?.keyFeatures?.[idx]?.message}
                                />
                                <Button
                                    type="button"
                                    onClick={() => removeKF(idx)}
                                    className="text-slate-400 hover:text-red-500 rounded-lg transition-colors p-0 bg-transparent"
                                >
                                    <X size={18} />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={() => appendKF("")}
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm py-2 px-4 shadow-none flex items-center gap-2"
                        >
                            <Plus size={16} /> Add Feature
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pros */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-slate-700">Pros</label>
                        </div>
                        <div className="space-y-3">
                            {pros.map((pro, idx) => (
                                <div key={pro.id} className="flex items-center gap-2">
                                    <Input
                                        className="w-full text-sm py-1.5"
                                        placeholder="Advantage..."
                                        {...register(`pros.${idx}`)}
                                        error={errors?.pros?.[idx]?.message}
                                    />
                                    <Button
                                        onClick={() => removePro(idx)}
                                        className="text-slate-400 p-0 bg-transparent hover:text-red-500"
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={() => appendPro("")}
                                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 w-full text-xs py-1.5 shadow-none"
                            >
                                + Add Pro
                            </Button>
                        </div>
                    </div>

                    {/* Cons */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-slate-700">Cons</label>
                        </div>
                        <div className="space-y-3">
                            {cons.map((con, idx) => (
                                <div key={con.id} className="flex items-center gap-2">
                                    <Input
                                        className="w-full text-sm py-1.5"
                                        placeholder="Disadvantage..."
                                        {...register(`cons.${idx}`)}
                                        error={errors?.cons?.[idx]?.message}
                                    />
                                    <Button
                                        onClick={() => removeCon(idx)}
                                        className="text-slate-400 p-0 bg-transparent hover:text-red-500"
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={() => appendCon("")}
                                className="bg-red-50 text-red-700 hover:bg-red-100 w-full text-xs py-1.5 shadow-none"
                            >
                                + Add Con
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductEssentials;
