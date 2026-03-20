import { Briefcase } from "lucide-react";
import { Dropdown, Input, Textarea } from "../../../common";

const BasicInfo = ({ register, watch, errors, setValue, categories }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-400" />
                Basic Information
            </h2>
            <div className="space-y-5">
                <Input
                    label="Product Name"
                    placeholder="e.g. Dell Inspiron 15 Laptop"
                    {...register("name")}
                    error={errors?.name?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Brand Name"
                        placeholder="e.g. Dell"
                        {...register("brandName")}
                        error={errors?.brandName?.message}
                    />

                    <Dropdown
                        label="Category"
                        name="category"
                        dropdownList={categories}
                        watch={watch}
                        {...register("category")}
                        error={errors?.category?.message}
                        setVal={setValue}
                        placeholder="Select Category"
                        className="w-full"
                    />
                </div>

                <Textarea
                    label="Description"
                    placeholder="Provide a detailed description of the product..."
                    rows={6}
                    {...register("description")}
                    error={errors?.description?.message}
                />
            </div>
        </div>
    );
};

export default BasicInfo;
