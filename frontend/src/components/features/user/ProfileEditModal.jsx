import { useForm } from "react-hook-form";
import { Button, Input } from "../../common";
import { useState } from "react";
import { UserApi } from "../../../apis";
import toast from "react-hot-toast";
import Loader from "../../loadings/Loader";
import { useAuth, useImageKitUpload } from "../../../hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserClient } from "../../../../../shared/validations/user.validations";

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

    const { handleUpload } = useImageKitUpload();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        const { fullname, phoneNumber, file } = data;

        setLoading(true);

        try {
            const filePromise = await handleUpload(file, { user: user._id }, "/avatars");
            const fileData = await Promise.all(filePromise);

            const res = await UserApi.updateUser({ fullname, phoneNumber, avatar: fileData[0] });

            if (res.data.success) {
                console.log(res.data.data);
                setUser(res.data.data);

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

    console.log(errors);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-base p-6 w-full max-w-lg space-y-6">
                <h3 className="text-lg font-semibold">Edit Profile</h3>

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
                            className="px-4 py-2 rounded-base"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="px-4 py-2 flex justify-center items-center gap-4 bg-black text-white rounded-base"
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

export default ProfileEditModal;
