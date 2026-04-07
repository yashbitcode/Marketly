import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus, Save } from "lucide-react";
import { Button } from "../../common";
import { useEffect } from "react";
import { 
    addParentCategoryValidations, 
    addSubCategoryValidations, 
    updateParentCategoryValidations, 
    updateSubCategoryValidations 
} from "shared/validations/category.validations";

const CategoryFormModal = ({ mode, initialData, parentCategories, onClose, onSubmit, loading }) => {
    const isEdit = mode.includes("edit");
    const isSub = mode.includes("Sub");

    const resolver = isSub 
        ? (isEdit ? updateSubCategoryValidations : addSubCategoryValidations)
        : (isEdit ? updateParentCategoryValidations : addParentCategoryValidations);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resolver),
        defaultValues: initialData || {},
    });

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    const handleFormSubmit = (data) => {
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 px-4 font-inter">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-orange p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-1.5 rounded-md">
                            {isEdit ? <Save size={18} /> : <Plus size={18} />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold tracking-tight">
                                {isEdit ? "Edit" : "Add"} {isSub ? "Sub Category" : "Category"}
                            </h3>
                            <p className="text-orange-100 text-[10px] font-medium uppercase tracking-widest opacity-80">
                                Management Portal
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-5">
                    <div className="space-y-4">
                        {/* Parent Category Select (Only for Add/Edit Sub) */}
                        {isSub && !isEdit && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5">
                                    Parent Category
                                </label>
                                <select
                                    {...register("parentCategory")}
                                    className={`w-full px-3 py-2.5 rounded-lg border appearance-none bg-gray-50 text-xs font-semibold transition-all focus:ring-2 focus:ring-orange/10 outline-none ${
                                        errors.parentCategory ? "border-red-500" : "border-gray-100 focus:border-orange"
                                    }`}
                                >
                                    <option value="">Select a parent category</option>
                                    {parentCategories?.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.parentCategory && (
                                    <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">
                                        {errors.parentCategory.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5">
                                Category Name
                            </label>
                            <input
                                {...register("name")}
                                type="text"
                                placeholder="e.g. Electronics, Home Decor..."
                                className={`w-full px-3 py-2.5 rounded-lg border bg-gray-50 text-xs font-semibold transition-all focus:ring-2 focus:ring-orange/10 outline-none ${
                                    errors.name ? "border-red-500" : "border-gray-100 focus:border-orange"
                                }`}
                            />
                            {errors.name && (
                                <p className="text-[9px] text-red-500 font-bold ml-1 uppercase">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1 py-2.5 border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-widest rounded-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 bg-orange text-white font-bold text-[10px] uppercase tracking-widest shadow shadow-orange/10 active:scale-95 disabled:opacity-50 rounded-lg"
                        >
                            {loading ? (
                                <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                            ) : (
                                isEdit ? "Update" : "Save"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormModal;
