import { useEffect, useState } from "react";
import { AddressesApi } from "../apis";
import toast from "react-hot-toast";

const useAddresses = () => {
    const [addresses, setAddresses] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await AddressesApi.getAll();
                if (res?.data?.success) setAddresses(res?.data?.data);
            } catch (err) {
                toast.error(err?.response?.data?.message || "Something went wrong", {
                    position: "right-top",
                });
            }
        };

        fetchData();
    }, []);

    return { addresses, setAddresses };
};

export default useAddresses;
