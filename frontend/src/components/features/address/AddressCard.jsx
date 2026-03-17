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
            className="border border-gray-100 rounded-xl bg-gray-50/30 hover:bg-gray-50/80 p-5 transition-all cursor-pointer group"
            onClick={() => markAddressAsDefault(address._id)}
        >
            <div className="flex justify-between max-[450px]:flex-col-reverse gap-4 items-start">
                <div>
                    <h3 className="font-semibold text-gray-900">{address.fullname}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 font-medium">{address.phoneNumber}</p>
                </div>

                <div className="flex gap-2 items-center flex-wrap">
                    {address.isDefault && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">
                            Default
                        </span>
                    )}

                    <span className="text-[10px] uppercase tracking-wider font-bold bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-md">
                        {address.addressType}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditAddress(address);
                            }}
                            className="text-xs bg-white border border-gray-200 text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg transition-colors shadow-sm"
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address._id);
                            }}
                            className="text-xs bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 px-3 py-1 rounded-lg transition-colors shadow-sm"
                        >
                            Delete
                        </Button>
                    </div>
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
