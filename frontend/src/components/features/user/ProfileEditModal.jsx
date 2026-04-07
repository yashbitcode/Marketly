import { useForm } from "react-hook-form";
import { Button, Input } from "../../common";
import { UserApi } from "../../../apis";
import Loader from "../../loadings/Loader";
import { useAuth, useImageKitUpload } from "../../../hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserClient } from "shared/validations/user.validations";
import { useMutation } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "../../../utils/toasts";

const ProfileEditModal = ({ user, onClose }) => {
    const { setUser } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            fullname: user?.fullname,
            phoneNumber: user?.phoneNumber,
        },
        resolver: zodResolver(updateUserClient),
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const { fullname, phoneNumber, file } = data;
            const payload = { fullname, phoneNumber };

            if (file && file?.length !== 0) {
                const filePromise = await handleUpload(file, { user: user._id }, "/avatars");
                const fileData = await Promise.all(filePromise);

                payload.avatar = fileData[0];
            }

            return UserApi.updateUser(payload);
        },
        onSuccess: (res) => {
            setUser(res);
            SuccessToast(res.message);
            onClose();
        },
        onError: (err) => {
            ErrorToast(err?.response?.data?.message || "Something went wrong");
        },
    });

    const { handleUpload } = useImageKitUpload();

    const onSubmit = async (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 bg-black/50 px-4 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg space-y-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight pb-4 border-b border-gray-100">Edit Profile</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Avatar"
                        type="file"
                        accept="image/jpeg, image/jpg, image/webp, image/png"
                        {...register("file")}
                        error={errors?.file?.message}
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

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium border-none"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="px-5 py-2.5 flex justify-center items-center gap-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-sm"
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

export default ProfileEditModal;
