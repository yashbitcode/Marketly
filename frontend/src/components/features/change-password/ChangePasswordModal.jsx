import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "../../common";
import { changePasswordValidations } from "../../../../../shared/validations/auth.validations";
import { AuthApi } from "../../../apis";
import Loader from "../../loadings/Loader";
import { useMutation } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";

const ChangePasswordModal = ({ onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(changePasswordValidations),
    });

    const mutation = useMutation({
        mutationFn: AuthApi.changePassword,
        onSuccess: (res) => {
            SuccessToast(res.message);
            onClose();
        },
        onError: (err) => {
            ErrorToast(err?.response?.data?.message || "Something went wrong");
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="fixed h-full backdrop-blur-sm px-4 inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 w-full max-w-md">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight pb-4 mb-6 border-b border-gray-100">Change Password</h3>

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

export default ChangePasswordModal;
