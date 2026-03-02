import { useEffect, useState } from "react";
import CategoryApi from "../apis/categoryApi";
import toast from "react-hot-toast";

const useCategories = () => {
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesRes = await CategoryApi.getAllCategories();
                setCategories(categoriesRes?.data?.data);
            } catch (err) {
                toast.error(err?.response?.data?.message || "Something went wrong", {
                    position: "right-top"
                });
            }
        };

        fetchData();
    }, []);

    return { categories };
}

export default useCategories;