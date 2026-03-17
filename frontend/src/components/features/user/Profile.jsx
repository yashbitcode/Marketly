import { useEffect, useState } from "react";
import { Key, Pen, Pencil, MapPin, Mail, Phone, ShieldCheck, User as UserIcon } from "lucide-react";
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

const ProfileField = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100/50 transition-all hover:bg-gray-50">
        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
            {Icon && <Icon size={18} />}
        </div>
        <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="font-medium text-gray-900">{value || <span className="text-gray-400 italic">Not provided</span>}</p>
        </div>
    </div>
);

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isApplyVendorOpen, setIsApplyVendorOpen] = useState(false);
    const { user } = useAuth();
    const { isError, error, data } = useQuery({
        queryKey: ["user-vendor-applications", user?._id],
        queryFn: VendorApplicationApi.getAllUserApplications,
        enabled: !!user?._id,
    });

    useEffect(() => {
        if (isError) ErrorToast(error?.response?.data?.message || "Something went wrong");
    }, [isError, error]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-12 font-inter">
            {/* Banner Section */}
            <div className="h-64 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <Container className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header Card */}
                <div className="relative -mt-24 mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end sm:-mt-20">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-gray-100 shadow-md flex justify-center items-center">
                                {user?.avatar?.url ? (
                                    <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-medium text-gray-400">
                                        {user.fullname?.substring(0, 2).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <Button
                                onClick={() => setIsOpen(true)}
                                className="absolute bottom-1 right-1 bg-white text-gray-600 hover:text-orange hover:bg-orange-50 p-2 rounded-full shadow-md border border-gray-100 transition-all z-10 size-9 flex items-center justify-center"
                                title="Edit Profile Details"
                            >
                                <Pencil size={16} />
                            </Button>
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left mb-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                                {getFormatedStr(user.fullname)}
                            </h1>
                            <p className="text-gray-500 font-medium mt-1 flex items-center justify-center sm:justify-start gap-1">
                                {user.role === "vendor" ? <Pen size={14} className="text-orange" /> : <UserIcon size={14} />}
                                {getFormatedStr(user.role)} Account
                            </p>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0 max-sm:flex-col">
                            <Button
                                onClick={() => setIsChangePasswordOpen(true)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-800 px-4 py-2.5 rounded-xl transition-all font-medium"
                            >
                                <Key size={16} />
                                <span className="hidden sm:inline">Password</span>
                            </Button>
                            
                            {user.role !== "vendor" && (
                                <Button
                                    onClick={() => setIsApplyVendorOpen(true)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-orange text-white hover:bg-orange/90 px-4 py-2.5 rounded-xl transition-all font-medium shadow-sm hover:shadow"
                                >
                                    <Pen size={16} />
                                    <span>Become Vendor</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ProfileField icon={UserIcon} label="Username" value={user?.username} />
                            <ProfileField icon={Mail} label="Email Address" value={user.email} />
                            <ProfileField icon={Phone} label="Phone Number" value={user.phoneNumber} />
                            <ProfileField 
                                icon={ShieldCheck} 
                                label="Verification Status" 
                                value={
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {user.isEmailVerified ? "Verified" : "Unverified"}
                                    </span>
                                } 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <MapPin className="text-gray-400" size={24} />
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Saved Addresses</h2>
                        </div>
                        <AddressSection />
                    </div>

                    {data?.data?.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                             <div className="flex items-center gap-2 mb-6">
                                <Pen className="text-gray-400" size={24} />
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Vendor Applications</h2>
                            </div>
                            <VendorApplicationsSection applications={data.data} />
                        </div>
                    )}
                </div>

                {/* Modals */}
                {isOpen && <ProfileEditModal user={user} onClose={() => setIsOpen(false)} />}
                {isChangePasswordOpen && <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />}
                {isApplyVendorOpen && <ApplyVendorModal onClose={() => setIsApplyVendorOpen(false)} userId={user._id} />}
            </Container>
        </div>
    );
};

export default Profile;
