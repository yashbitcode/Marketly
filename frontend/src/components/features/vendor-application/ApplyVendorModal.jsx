import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Dropdown, Textarea } from "../../common";
import { createVendorApplicationValidations } from "../../../../../shared/validations/vendorApplication.validations";
import { VENDOR_TYPE } from "../../../../../shared/constants";
import { useState } from "react";
import toast from "react-hot-toast";
import { VendorApplicationApi } from "../../../apis";
import Loader from "../../loadings/Loader";

const ApplyVendorModal = ({ onClose }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createVendorApplicationValidations),
    });
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const res = await VendorApplicationApi.createVendorApplication(data);
            if (res.data.success) {
                toast.success(res.data.message, {
                    position: "right-top",
                });

                onClose();
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
        <div className="fixed h-full inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto px-4">
            <div className="bg-white rounded-base p-6 w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-6">Apply Vendor Application</h3>

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
