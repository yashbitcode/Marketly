import { memo } from "react";
import { Button } from "../../../common";

const ProductAttributes = ({ handleSetAttributes, attributes, productAttributes }) => {
    return productAttributes?.map((attr) => (
        <div className="mb-6">
            <p className="text-sm font-semibold text-slate-900 mb-2.5">
                <span className="text-slate-400 font-normal">{attr.name}: </span>
            </p>
            <div className="flex gap-3">
                {(attr.isVariant ? attr.value : [attr.value]).map((val, idx) => (
                    <Button
                        key={idx}
                        onClick={() => handleSetAttributes(attr.name, idx)}
                        title={val}
                        className={`max-w-100 bg-green font-medium rounded-full cursor-pointer border-0 shadow-md transition-all duration-200 ${
                            attributes?.[attr.name] === idx
                                ? "ring-2 ring-orange ring-offset-2 scale-110"
                                : "hover:scale-105"
                        }`}
                    >
                        {val}
                    </Button>
                ))}
            </div>
        </div>
    ));
};

export default memo(ProductAttributes);
