import { Button } from "../../common";
import { AddressesApi } from "../../../apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../hooks";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";

const AddressCard = ({ address, markAddressAsDefault, handleEditAddress }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (addressId) => AddressesApi.delete(addressId),
        onSuccess: (res, addressId) => {
            queryClient.setQueryData(["addresses", user._id], (prev) => {
                const updatedAddresses = prev?.data.filter((address) => address._id !== addressId);
                return { ...prev, data: updatedAddresses };
            });

            SuccessToast(res.message);
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Something went wrong"),
    });

    const handleDeleteAddress = async (addressId) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        mutation.mutate(addressId);
    };
    return (
        <div
            className=" rounded-base p-4 shadow-base transition cursor-pointer"
            onClick={() => markAddressAsDefault(address._id)}
        >
            <div className="flex justify-between max-[450px]:flex-col-reverse gap-3  items-start">
                <div>
                    <h3 className="font-medium">{address.fullname}</h3>
                    <p className="text-sm text-gray-600">{address.phoneNumber}</p>
                </div>

                <div className="flex gap-3 items-center flex-wrap">
                    {address.isDefault && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                            Default
                        </span>
                    )}

                    <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
                        {address.addressType}
                    </span>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address);
                        }}
                        className="text-xs text-black bg-neutral-100 px-2 py-1 rounded-full"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address._id);
                        }}
                        className="text-xs text-black bg-neutral-100 px-2 py-1 rounded-full"
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <div className="mt-3 text-sm text-gray-600">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                    {address.city}, {address.state} - {address.postalCode}
                </p>
                <p>{address.country}</p>
            </div>
        </div>
    );
};

export default AddressCard;
