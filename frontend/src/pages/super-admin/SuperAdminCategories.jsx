import { useState } from "react";
import { Container, Button } from "../../components/common";
import { LayoutGrid, Plus, Edit2, Trash2, ArrowLeft, Tags, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCategoriesManager } from "../../hooks";
import Loader from "../../components/loadings/Loader";
import CategoryFormModal from "../../components/features/super-admin/CategoryFormModal";

const SuperAdminCategories = () => {
    const navigate = useNavigate();
    const { 
        categories, 
        loading, 
        addParentMutation, 
        addSubMutation, 
        updateParentMutation, 
        updateSubMutation, 
        deleteParentMutation, 
        deleteSubMutation 
    } = useCategoriesManager();

    const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: "", initialData: null });

    const handleOpenModal = (mode, initialData = null) => {
        setModalConfig({ isOpen: true, mode, initialData });
    };

    const handleCloseModal = () => {
        setModalConfig({ isOpen: false, mode: "", initialData: null });
    };

    const handleFormSubmit = async (data) => {
        const { mode, initialData } = modalConfig;
        
        try {
            if (mode === "addParent") await addParentMutation.mutateAsync(data);
            else if (mode === "addSub") await addSubMutation.mutateAsync(data);
            else if (mode === "editParent") await updateParentMutation.mutateAsync({ slug: initialData.slug, payload: data });
            else if (mode === "editSub") await updateSubMutation.mutateAsync({ slug: initialData.slug, payload: data });
            
            handleCloseModal();
        } catch {
            // 
        }
    };

    const handleDelete = (id, type) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this category? This action cannot be undone.");
        if (isConfirmed) {
            if (type === "parent") deleteParentMutation.mutate(id);
            else deleteSubMutation.mutate(id);
        }
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader /></div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-inter">
            <Container className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <Button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange transition-colors mb-4 font-semibold bg-transparent outline-none border-none cursor-pointer"
                        >
                            <ArrowLeft size={16} /> Back
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange/10 rounded-lg">
                                <LayoutGrid size={24} className="text-orange" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Category Manager</h1>
                                <p className="text-xs text-gray-500 font-medium italic">Define platform structure and sub-categories</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => handleOpenModal("addParent")}
                        className="bg-orange text-white py-2.5 px-6 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest shadow-md shadow-orange/10 active:scale-95 transition-all w-fit"
                    >
                        <Plus size={18} strokeWidth={2.5} /> New Category
                    </Button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories?.parentCategories?.length > 0 ? (
                        categories.parentCategories.map((parent) => (
                            <div 
                                key={parent._id} 
                                className="group bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:shadow-orange/5"
                            >
                                {/* Parent Info */}
                                <div className="p-4 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white rounded-md shadow-sm border border-gray-100/50">
                                            <Folder size={16} className="text-orange" />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 uppercase truncate max-w-[150px]">
                                            {parent.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            onClick={() => handleOpenModal("editParent", parent)}
                                            className="p-1.5 hover:bg-orange/10 bg-transparent text-gray-400 hover:text-orange rounded transition-colors"
                                        >
                                            <Edit2 size={12} />
                                        </Button>
                                        <Button 
                                            onClick={() => handleDelete(parent._id, "parent")}
                                            className="p-1.5 hover:bg-red-50 bg-transparent text-gray-400 hover:text-red-500 rounded transition-colors"
                                        >
                                            <Trash2 size={12} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-4 flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                            <Tags size={10} /> Sub Categories
                                        </span>
                                        <Button 
                                            onClick={() => handleOpenModal("addSub", { parentCategory: parent._id })}
                                            className="text-[9px] font-bold bg-transparent p-0 text-orange hover:underline uppercase tracking-widest"
                                        >
                                            + Add
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {categories?.subCategories?.length > 0 && categories.subCategories.filter(el => el.parentCategory === parent._id).length > 0 ? (
                                            categories?.subCategories?.filter((el) => el.parentCategory === parent._id).map((sub) => (
                                                <div 
                                                    key={sub._id}
                                                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-orange/10 text-gray-600 hover:text-orange px-2.5 py-1 rounded-md text-[10px] font-bold transition-all border border-transparent hover:border-orange/20 cursor-default group/sub"
                                                >
                                                    <span className="uppercase">{sub.name}</span>
                                                    <div className="flex items-center gap-1 overflow-hidden w-0 group-hover/sub:w-fit ">
                                                        <Button 
                                                            onClick={() => handleOpenModal("editSub", sub)}
                                                            className="text-gray-400 bg-transparent p-0 hover:text-orange"
                                                        >
                                                            <Edit2 size={10} />
                                                        </Button>
                                                        <Button 
                                                            onClick={() => handleDelete(sub._id, "sub")}
                                                            className="text-gray-400 p-0 bg-transparent hover:text-red-500"
                                                        >
                                                            <Trash2 size={10} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[10px] text-gray-400 italic font-medium">No sub-categories defined</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full p-12 text-center bg-white rounded-lg border-2 border-dashed border-gray-100 opacity-50 grayscale transition-all hover:opacity-80">
                            <LayoutGrid size={48} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 uppercase mb-1">No Categories Found</h3>
                            <p className="text-xs text-gray-500 font-medium italic">Define platform structure to start adding products</p>
                            <Button
                                onClick={() => handleOpenModal("addParent")}
                                className="mt-6 bg-gray-900 text-white py-2.5 px-6 rounded-lg mx-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                            >
                                <Plus size={16} /> Create First Category
                            </Button>
                        </div>
                    )}
                </div>
            </Container>

            {/* Form Modal */}
            {modalConfig.isOpen && (
                <CategoryFormModal 
                    {...modalConfig}
                    parentCategories={categories?.parentCategories}
                    onClose={handleCloseModal}
                    onSubmit={handleFormSubmit}
                    loading={
                        addParentMutation.isPending || 
                        addSubMutation.isPending || 
                        updateParentMutation.isPending || 
                        updateSubMutation.isPending
                    }
                />
            )}
        </div>
    );
};

export default SuperAdminCategories;
