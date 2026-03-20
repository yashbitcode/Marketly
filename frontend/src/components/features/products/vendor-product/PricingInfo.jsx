import { Tag } from "lucide-react";
import { Input } from "../../../common";

const PricingInfo = ({ register, errors }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <Tag className="w-5 h-5 text-slate-400" />
                Pricing & Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <Input
                        label="Price (₹)"
                        type="number"
                        placeholder="0.00"
                        className="no-spinner"
                        {...register("price", { valueAsNumber: true })}
                        error={errors?.price?.message}
                    />
                </div>
                <div className="space-y-1.5">
                    <Input
                        label="Stock Quantity"
                        type="number"
                        className="no-spinner"
                        placeholder="Enter total units"
                        {...register("stockQuantity", { valueAsNumber: true })}
                        error={errors?.stockQuantity?.message}
                    />
                </div>
            </div>
        </div>
    );
};

export default PricingInfo;
