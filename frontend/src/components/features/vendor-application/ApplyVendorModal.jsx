import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Dropdown, Textarea } from "../../common";
import { createVendorApplicationValidations } from "shared/validations/vendorApplication.validations";
import { VENDOR_TYPE } from "shared/constants";
import { VendorApplicationApi } from "../../../apis";
import Loader from "../../loadings/Loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";

const ApplyVendorModal = ({ onClose, userId }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createVendorApplicationValidations),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data) => VendorApplicationApi.createVendorApplication(data),
        onSuccess: (res) => {
            SuccessToast(res.message);
            queryClient.setQueryData(["user-vendor-applications", userId], (prev) => ({
                ...prev,
                data: [res.data, ...(prev?.data || [])],
            }));
            onClose();
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Something went wrong"),
    });

    const onSubmit = async (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="fixed h-full inset-0 backdrop-blur-sm bg-black/50 flex flex-col items-center justify-center z-50 overflow-y-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 w-full max-w-lg my-auto">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight pb-4 mb-6 border-b border-gray-100">Apply for Vendor Account</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* <div> */}
                    <Dropdown
                        label="Vendor Type"
                        placeholder={"Vendor Type"}
                        {...register("vendorType")}
                        watch={watch}
                        error={errors?.vendorType?.message}
                        dropdownList={VENDOR_TYPE}
                        setVal={setValue}
                    />

                    <Input
                        label="Store Name"
                        placeholder="Store Name"
                        {...register("storeName")}
                        error={errors?.storeName?.message}
                    />

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

                    <Textarea
                        label="Description"
                        rows="2"
                        placeholder={"Description"}
                        {...register("description")}
                        error={errors?.description?.message}
                    />
                    {/* </div> */}

                    <div className="flex justify-end gap-3 pt-4">
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

export default ApplyVendorModal;
