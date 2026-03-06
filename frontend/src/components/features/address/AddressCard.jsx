import toast from "react-hot-toast";
import { Button } from "../../common";
import { AddressesApi } from "../../../apis";

const AddressCard = ({ address, markAddressAsDefault, handleEditAddress, setAddresses }) => {
    const handleDeleteAddress = async (addressId) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            const res = await AddressesApi.delete(addressId);

            if (res?.data?.success) {
                setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
                toast.success(res.data.message, {
                    position: "right-top",
                });
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong", {
                position: "right-top",
            });
        }
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

                <div className="flex gap-3 items-center">
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
