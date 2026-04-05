import axiosClient from "../config/axiosClient";
import { apiEndpoints } from "../utils/constants";

const CategoryApi = {
    getAllCategories: async () => (await axiosClient.get(apiEndpoints.category.getAll)).data,
    
    // Parent Categories
    getParentCategories: async () => (await axiosClient.get(apiEndpoints.category.getParent)).data,
    addParentCategory: async (payload) => (await axiosClient.post(apiEndpoints.category.addParent, payload)).data,
    updateParentCategory: async (slug, payload) => (await axiosClient.patch(`${apiEndpoints.category.updateParent}/${slug}`, payload)).data,
    deleteParentCategory: async (id) => (await axiosClient.delete(`${apiEndpoints.category.deleteParent}/${id}`)).data,

    // Sub Categories
    getSubCategories: async () => (await axiosClient.get(apiEndpoints.category.getSub)).data,
    addSubCategory: async (payload) => (await axiosClient.post(apiEndpoints.category.addSub, payload)).data,
    updateSubCategory: async (slug, payload) => (await axiosClient.patch(`${apiEndpoints.category.updateSub}/${slug}`, payload)).data,
    deleteSubCategory: async (id) => (await axiosClient.delete(`${apiEndpoints.category.deleteSub}/${id}`)).data,
};

export default CategoryApi;
