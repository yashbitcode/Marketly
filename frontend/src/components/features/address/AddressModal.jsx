import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Dropdown } from "../../common";
import { addAddressValidations } from "shared/validations/address.validations";
import { ADDRESS_TYPE } from "shared/constants";
import { AddressesApi } from "../../../apis";
import Loader from "../../loadings/Loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../hooks";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";

const AddressModal = ({ onClose, updateAddress, setUpdateAddress }) => {
    const { user } = useAuth();
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

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data) => {
            if (updateAddress) return AddressesApi.update(updateAddress._id, data);
            else return AddressesApi.add(data);
        },
        onSuccess: (res) => {
            queryClient.setQueryData(["addresses", user._id], (prev) => {
                const updatedAddresses = prev?.data.map((addr) =>
                    addr._id === updateAddress?._id ? res.data : addr,
                );

                return { ...prev, data: updatedAddresses };
            });

            setUpdateAddress(null);
            SuccessToast(res.message);
            onClose();
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Something went wrong"),
    });

    const onSubmit = async (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex flex-col items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 w-full max-w-lg my-10">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight pb-4 mb-6 border-b border-gray-100">Add New Address</h3>

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

                    <div className="col-span-2 flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium border-gray-200"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl flex justify-center items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-sm font-medium"
                            disabled={isSubmitting}
                        >
                            {mutation.isPending ? (
                                <>
                                    <div className="w-fit">
                                        <Loader />
                                    </div>
                                    Loading...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
