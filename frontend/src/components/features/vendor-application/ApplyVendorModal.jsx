import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Dropdown, Textarea } from "../../common";
import { createVendorApplicationValidations } from "../../../../../shared/validations/vendorApplication.validations";
import { VENDOR_TYPE } from "../../../../../shared/constants";

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

    const onSubmit = async (data) => {
        console.log("Vendor Application:", data);
        // call API here
        onClose();
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

                        <Button type="submit" disabled={isSubmitting}>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyVendorModal;
