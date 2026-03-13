import { useEffect, useState } from "react";
import { Key, Pen, Pencil } from "lucide-react";
import ProfileEditModal from "./ProfileEditModal";
import { Button, Container } from "../../common";
import VendorApplicationsSection from "../vendor-application/VendorApplicationsSection";
import ApplyVendorModal from "../vendor-application/ApplyVendorModal";
import ChangePasswordModal from "../change-password/ChangePasswordModal";
import { useAuth } from "../../../hooks";
import { VendorApplicationApi } from "../../../apis";
import { getFormatedStr } from "../../../utils/helpers";
import AddressSection from "../address/AddressSection";
import { ErrorToast } from "../../../utils/toasts";
import { useQuery } from "@tanstack/react-query";

const ProfileField = ({ label, value, full }) => (
    <div className={full ? "col-span-2" : ""}>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value || "-"}</p>
    </div>
);

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isApplyVendorOpen, setIsApplyVendorOpen] = useState(false);
    const { user } = useAuth();
    const { isError, error, data } = useQuery({
        queryKey: ["user-vendor-applications", user._id],
        queryFn: VendorApplicationApi.getAllUserApplications,
    });

    useEffect(() => {
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong");
    }, [isError, error]);

    return (
        <Container className="max-w-4xl mx-auto p-6 space-y-8 font-inter">
            <h1 className="text-4xl text-center font-medium">User Profile</h1>
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-neutral-200 bg-dark/80 shadow-base flex justify-center items-center">
                        {user?.avatar?.url ? (
                            <img src={user.avatar.url} />
                        ) : (
                            <span className="text-4xl text-base-white">
                                {user.fullname.substring(0, 2).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-white shadow-base rounded-base p-4 relative">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="absolute bg-transparent p-0 text-dark top-5.5 right-5 hover:text-dark/70"
                >
                    <Pencil size={18} />
                </Button>

                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

                <div className="grid grid-cols-2 max-[500px]:grid-cols-1 gap-6">
                    <ProfileField label="Full Name" value={getFormatedStr(user.fullname)} />
                    <ProfileField label="Username" value={user?.username} />
                    <ProfileField label="Email" value={user.email} />
                    <ProfileField label="Phone Number" value={user.phoneNumber} />
                    <ProfileField label="Role" value={getFormatedStr(user.role)} />
                    <ProfileField
                        label="Email Verified"
                        value={user.isEmailVerified ? "Yes" : "No"}
                    />
                </div>
            </div>

            <div className="bg-white shadow-base rounded-base p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Security & Vendor</h2>

                <div className="flex gap-3 items-center">
                    <Button
                        onClick={() => setIsChangePasswordOpen(true)}
                        className="bg-black text-white p-1 size-8 flex justify-center items-center"
                        title="Change Password"
                    >
                        <Key size={20} />
                    </Button>

                    <Button
                        variant="secondary"
                        className="p-1 justify-center size-8 items-center"
                        title="Apply Vendor"
                        onClick={() => setIsApplyVendorOpen(true)}
                    >
                        <Pen size={20} />
                    </Button>
                </div>
            </div>

            <AddressSection />

            {isChangePasswordOpen && (
                <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />
            )}

            {isApplyVendorOpen && (
                <ApplyVendorModal onClose={() => setIsApplyVendorOpen(false)} userId={user._id} />
            )}

            {data?.data?.length > 0 && <VendorApplicationsSection applications={data.data} />}

            {isOpen && <ProfileEditModal user={user} onClose={() => setIsOpen(false)} />}
        </Container>
    );
};

export default Profile;
