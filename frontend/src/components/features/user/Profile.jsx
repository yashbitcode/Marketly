// const
import { useState } from "react";
import { Pencil } from "lucide-react";
import ProfileEditModal from "./ProfileEditModal";
import { Button, Container } from "../../common";
import VendorApplicationsSection from "../vendor-application/VendorApplicationsSection";
import ApplyVendorModal from "../vendor-application/ApplyVendorModal";
import ChangePasswordModal from "../change-password/ChangePasswordModal";

const ProfileField = ({ label, value, full }) => (
    <div className={full ? "col-span-2" : ""}>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value || "-"}</p>
    </div>
);

const Profile = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isApplyVendorOpen, setIsApplyVendorOpen] = useState(false);

    const vendorApplications = [
        {
            _id: "1",
            vendorType: "individual",
            storeName: "Tech Store",
            fullname: "Yash",
            phoneNumber: "+919999999999",
            applicationStatus: "rejected",
            remarks: "Incomplete documents",
        },
        {
            _id: "2",
            vendorType: "company",
            storeName: "Marketly Electronics",
            fullname: "Yash Kumar",
            phoneNumber: "+919999999999",
            applicationStatus: "pending",
            remarks: "",
        },
        {
            _id: "3",
            vendorType: "company",
            storeName: "Marketly Electronics",
            fullname: "Yash Kumar",
            phoneNumber: "+919999999999",
            applicationStatus: "approved",
            remarks: "",
        },
    ];

    return (
        <Container className="max-w-4xl mx-auto p-6 space-y-8 font-inter">
            {/* Profile Section */}
            <div className="bg-white shadow-base rounded-base p-4 relative">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="absolute bg-transparent p-0 text-dark top-7 right-5 hover:text-dark/70"
                >
                    <Pencil size={18} />
                </Button>

                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

                <div className="grid grid-cols-2 max-[500px]:grid-cols-1 gap-6">
                    <ProfileField label="Full Name" value={user?.fullname || "Yash"} />
                    <ProfileField label="Username" value={user?.username || "Yash"} />
                    <ProfileField label="Email" value={user?.email || "sample@gmail.com"} />
                    <ProfileField
                        label="Phone Number"
                        value={user?.phoneNumber || "+91 999999999"}
                    />
                    <ProfileField label="Role" value={user?.role || "User"} />
                    <ProfileField
                        label="Email Verified"
                        value={user?.isEmailVerified ? "Yes" : "No"}
                    />
                </div>
            </div>

            <div className="bg-white shadow-base rounded-base p-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Security & Vendor</h2>

                <div className="flex gap-3">
                    <Button
                        onClick={() => setIsChangePasswordOpen(true)}
                        className="bg-black text-white"
                    >
                        Change Password
                    </Button>

                    <Button onClick={() => setIsApplyVendorOpen(true)} variant="outline">
                        Apply Vendor
                    </Button>
                </div>
            </div>

            {isChangePasswordOpen && (
                <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />
            )}

            {isApplyVendorOpen && <ApplyVendorModal onClose={() => setIsApplyVendorOpen(false)} />}

            {/* Vendor Application (Read Only) */}
            {vendorApplications?.length > 0 && (
                <VendorApplicationsSection applications={vendorApplications} />
            )}

            {isOpen && <ProfileEditModal user={user} onClose={() => setIsOpen(false)} />}
        </Container>
    );
};

export default Profile;
