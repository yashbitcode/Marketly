import { useForm } from "react-hook-form";
import { Button, Input } from "../../common";

const ProfileEditModal = ({ user, onClose }) => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            fullname: user?.fullname,
            username: user?.username,
            phoneNumber: user?.phoneNumber || "+91 999999999",
        },
    });

    const onSubmit = (data) => {
        console.log(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-base p-6 w-full max-w-lg space-y-6">
                <h3 className="text-lg font-semibold">Edit Profile</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Full Name" {...register("fullname")} />

                    <Input label="Username" {...register("username")} />

                    <Input label="Phone Number" {...register("phoneNumber")} />

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
                            className="px-4 py-2 bg-black text-white rounded-base"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
