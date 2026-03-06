import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Dropdown } from "../../common";
import { addAddressValidations } from "../../../../../shared/validations/address.validations";
import { ADDRESS_TYPE } from "../../../../../shared/constants";
import { AddressesApi } from "../../../apis";
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "../../loadings/Loader";

const AddressModal = ({ onClose, setAddresses, updateAddress, setUpdateAddress }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(addAddressValidations),
        defaultValues: {
            fullname: updateAddress?.fullname || "",
            phoneNumber: updateAddress?.phoneNumber || "",
            addressLine1: updateAddress?.addressLine1 || "",
            addressLine2: updateAddress?.addressLine2 || "",
            addressType: updateAddress?.addressType || "",
            city: updateAddress?.city || "",
            state: updateAddress?.state || "",
            postalCode: updateAddress?.postalCode || "",
            country: updateAddress?.country || "",
        },
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);

        console.log("Address Data:", data);
        try {
            if (updateAddress) {
                const res = await AddressesApi.update(updateAddress._id, data);
                if (res?.data?.success) {
                    setAddresses((prev) =>
                        prev.map((addr) => (addr._id === updateAddress._id ? res.data.data : addr)),
                    );
                    setUpdateAddress(null);
                    onClose();
                }
            } else {
                const res = await AddressesApi.add(data);

                if (res?.data?.success) {
                    setAddresses((prev) => [...prev, res.data.data]);
                    onClose();
                }
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong", {
                position: "right-top",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-base p-6 w-full max-w-lg my-10">
                <h3 className="text-lg font-semibold mb-6">Add New Address</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 max-h-100 pb-3 scrollbar-thin-custom overflow-y-auto">
                        <Input
                            label="Full Name"
                            placeholder="Full Name"
                            {...register("fullname")}
                            error={errors?.fullname?.message}
                        />

                        <Input
                            label="Phone Number"
                            placeholder="Phone Number"
                            {...register("phoneNumber")}
                            error={errors?.phoneNumber?.message}
                        />

                        <Input
                            label="Address Line 1"
                            placeholder="Address Line 1"
                            {...register("addressLine1")}
                            error={errors?.addressLine1?.message}
                        />

                        <Input
                            label="Address Line 2"
                            placeholder="Address Line 2"
                            {...register("addressLine2")}
                            error={errors?.addressLine2?.message}
                        />
                        <Dropdown
                            label="Address Type"
                            placeholder={"Address Type"}
                            watch={watch}
                            {...register("addressType")}
                            error={errors?.addressType?.message}
                            dropdownList={ADDRESS_TYPE}
                            setVal={setValue}
                        />

                        <Input
                            label="City"
                            placeholder="City"
                            {...register("city")}
                            error={errors?.city?.message}
                        />

                        <Input
                            label="State"
                            placeholder="State"
                            {...register("state")}
                            error={errors?.state?.message}
                        />

                        <Input
                            label="Postal Code"
                            placeholder="Postal Code"
                            {...register("postalCode")}
                            error={errors?.postalCode?.message}
                        />

                        <Input
                            label="Country"
                            placeholder="Country"
                            {...register("country")}
                            error={errors?.country?.message}
                        />
                    </div>

                    <div className="col-span-2 flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="flex justify-center items-center gap-4"
                            disabled={isSubmitting}
                        >
                            {loading ? (
                                <>
                                    <div className="w-fit">
                                        <Loader />
                                    </div>
                                    Loading...
                                </>
                            ) : (
                                "Save Address"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
