import { useState } from "react";
import AddressCard from "./AddressCard";
import { useAddresses, useAuth } from "../../../hooks";
import AddressModal from "./AddressModal";
import { Button } from "../../common";
import { Plus } from "lucide-react";
import { AddressesApi } from "../../../apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";

const AddressSection = () => {
    const { user } = useAuth();
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const { addresses, setAddresses } = useAddresses();
    const queryClient = useQueryClient();
    const [updateAddress, setUpdateAddress] = useState(null);

    const mutation = useMutation({
        mutationFn: (addressId) => AddressesApi.markDefault(addressId),
        onSuccess: (res, addressId) => {
            console.log(res);
            queryClient.setQueryData(["addresses", user._id], (prev) => {
                const updatedAddresses = prev?.data.map((address) => {
                    if (address._id === addressId) return { ...address, isDefault: true };
                    else return { ...address, isDefault: false };
                });
                return { ...prev, data: updatedAddresses };
            });
            SuccessToast(res.message);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Something went wrong"),
    });

    const markAddressAsDefault = async (addressId) => {
        if (!confirm("Do you want to mark this address as default?")) return;

        mutation.mutate(addressId);
    };

    const handleEditAddress = (address) => {
        setUpdateAddress(address);
        setIsAddressModalOpen(true);
    };

    return (
        <>
            <div className="bg-white shadow-base rounded-base p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">My Addresses</h2>

                    <Button
                        onClick={() => setIsAddressModalOpen(true)}
                        className="bg-black text-white p-1"
                        title="Add Addresses"
                    >
                        <Plus />
                    </Button>
                </div>

                {!addresses || addresses?.length === 0 ? (
                    <div className="border border-dashed rounded-base p-6 text-center bg-neutral-50">
                        <p className="text-gray-600 font-medium">No addresses added yet.</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Add an address to speed up your checkout process.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-87.5 overflow-y-auto scrollbar-thin-custom p-2">
                        {addresses?.map((address) => (
                            <AddressCard
                                key={address._id}
                                address={address}
                                markAddressAsDefault={markAddressAsDefault}
                                handleEditAddress={handleEditAddress}
                                setAddresses={setAddresses}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isAddressModalOpen && (
                <AddressModal
                    onClose={() => setIsAddressModalOpen(false)}
                    updateAddress={updateAddress}
                    setUpdateAddress={setUpdateAddress}
                />
            )}
        </>
    );
};

export default AddressSection;
