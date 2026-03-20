import { useFieldArray } from "react-hook-form";
import { ATTRIBUTE_DATATYPES } from "../../../../../../shared/constants";
import { ListPlus, X } from "lucide-react";
import { Button, Dropdown, Input } from "../../../common";

const ProductAttributes = ({ register, errors, watch, setValue, control }) => {
    const {
        fields: attributes,
        append: appendAttr,
        remove: removeAttr,
    } = useFieldArray({
        control,
        name: "attributes",
    });

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-slate-400" />
                Product Attributes
            </h2>
            <div className="space-y-4">
                {attributes.map((attr, idx) => (
                    <div
                        key={attr.id}
                        className="flex flex-wrap items-end gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"
                    >
                        <div className="w-full">
                            <Input
                                label={"Name"}
                                {...register(`attributes.${idx}.name`)}
                                error={errors?.attributes?.[idx]?.name?.message}
                                labelClassName="w-full text-xs font-medium text-slate-500"
                                className="py-1.5 text-sm bg-white"
                                placeholder="e.g. Color"
                            />
                        </div>
                        <div className="grow">
                            <Dropdown
                                label="Data Type"
                                labelClassName="text-xs font-medium text-slate-500"
                                {...register(`attributes.${idx}.dataType`)}
                                error={errors?.attributes?.[idx]?.dataType?.message}
                                placeholder={"e.g. Text, Number"}
                                dropdownList={ATTRIBUTE_DATATYPES}
                                watch={watch}
                                setVal={setValue}
                                className="py-1.5 text-sm bg-white w-full"
                            />
                        </div>
                        <div className="w-full">
                            <Input
                                labelClassName="text-xs font-medium w-full text-slate-500"
                                label={"Value"}
                                className="py-1.5 text-sm bg-white"
                                placeholder="e.g. Red, Blue"
                                {...register(`attributes.${idx}.value`)}
                                error={errors?.attributes?.[idx]?.value?.message}
                            />
                        </div>
                        <div className="flex items-center h-full pb-2">
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <Input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-orange focus:ring-orange"
                                    {...register(`attributes.${idx}.isVariant`)}
                                    error={errors?.attributes?.[idx]?.isVariant?.message}
                                />
                                Variant
                            </label>
                        </div>
                        <Button
                            onClick={() => removeAttr(idx)}
                            className="p-2 bg-transparent mb-0.5 text-slate-400  hover:text-red-500 rounded-lg transition-colors -ml-3"
                            title="Remove Attribute"
                        >
                            <X size={18} />
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    onClick={() =>
                        appendAttr({
                            name: "",
                            dataType: "text",
                            isVariant: false,
                            value: "",
                        })
                    }
                    className="w-full bg-white border-2 border-dashed border-slate-200 text-slate-600 hover:border-orange hover:text-orange hover:bg-orange/5 shadow-none transition-colors py-3"
                >
                    + Add New Attribute
                </Button>
            </div>
        </div>
    );
};


export default ProductAttributes;