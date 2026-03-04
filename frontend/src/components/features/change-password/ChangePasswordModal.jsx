import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "../../common";
import { changePasswordValidations } from "../../../../../shared/validations/auth.validations";

const ChangePasswordModal = ({ onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(changePasswordValidations),
    });

    const onSubmit = async (data) => {
        console.log("Change Password Data:", data);
        // call API here
        onClose();
    };

    return (
        <div className="fixed h-full inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-base p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-6">Change Password</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Old Password"
                        placeholder="Old Password"
                        type="password"
                        {...register("oldPassword")}
                        error={errors?.oldPassword?.message}
                    />

                    <Input
                        label="New Password"
                        placeholder="New Password"
                        type="password"
                        {...register("newPassword")}
                        error={errors?.newPassword?.message}
                    />

                    <Input
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        type="password"
                        {...register("confirmPassword")}
                        error={errors?.confirmPassword?.message}
                    />

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

export default ChangePasswordModal;
