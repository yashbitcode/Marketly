import { useState } from "react";
import { useAuth } from "../hooks";
import { Container, Input, Button, Dropdown } from "../components/common";
import { Navigate, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createConnectedAccountValidations } from "../../../shared/validations/vendorStripe.validations";
import { BUSINESS_SIZE } from "../../../shared/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import vendorStripeApi from "../apis/vendorStripeApi";
import { SuccessToast, ErrorToast } from "../utils/toasts";
import Loader from "../components/loadings/Loader";
import { 
    User, 
    Mail, 
    Phone, 
    Store, 
    ShieldCheck, 
    CreditCard, 
    Calendar,
    Globe,
    CheckCircle,
    X
} from "lucide-react";

const CreateAccountModal = ({ onClose, userEmail }) => {
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createConnectedAccountValidations),
        defaultValues: {
            email: userEmail,
        }
    });

    const mutation = useMutation({
        mutationFn: vendorStripeApi.createConnectedAccount,
        onSuccess: (res) => {
            SuccessToast(res.message || "Stripe account initialized successfully");
            queryClient.invalidateQueries(["user"]);
            onClose();
        },
        onError: (err) => {
            ErrorToast(err?.response?.data?.message || "Failed to initialize Stripe account");
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-dark">Initialize Stripe Account</h3>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-dark"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Provide your business details to create a secure Stripe connected account for processing payments.
                    </p>
                    <Dropdown 
                        label="Business Size"
                        name="businessSize"
                        watch={watch}
                        setVal={setValue}
                        {...register("businessSize")}
                        dropdownList={BUSINESS_SIZE}
                        placeholder="Select business size"
                        error={errors?.businessSize?.message}
                    />

                    <Input 
                        label="Account Email"
                        value={userEmail}
                        disabled
                    />

                    <Input 
                        label="Business Category"
                        placeholder="e.g., Retail, Electronics, Services"
                        {...register("businessCategory")}
                        error={errors?.businessCategory?.message}
                    />

                    <div className="pt-2">
                        <Button 
                            type="submit" 
                            className="w-full py-3 flex justify-center items-center gap-2 bg-orange hover:bg-orange/90 text-white font-bold rounded-xl shadow-lg shadow-orange/20"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <div className="flex items-center justify-center gap-3">
                                    <Loader />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                "Create Stripe Account"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-light-green/50 transition-colors">
        <div className="p-2.5 bg-green/10 rounded-lg text-green">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-tight">{label}</p>
            <p className="text-base font-medium text-dark">{value || "Not provided"}</p>
        </div>
    </div>
);

const VendorProfile = () => {
    const { user } = useAuth();
    const [isInitModalOpen, setIsInitModalOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: vendorStripeApi.getOnboardingLink,
        onSuccess: (res) => {
            console.log(res.data)
            // if(res.success) window.location.href = res.data.onboardLink;
        },
        onError: (err) => {
            ErrorToast(err?.response?.data?.message || "Failed to onboard vendor");
        },
    });

    if (!user) return <Navigate to="/login" />;

    const vendor = user.vendorId;

    return (
        <div className="min-h-screen bg-base-white py-12 font-inter">
            <Container className="max-w-6xl mx-auto px-4">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-dark tracking-tight">Vendor Profile</h1>
                    <p className="text-gray-500 mt-2">Manage your professional identity and store information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Sidebar: Profile Info */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white rounded-lg border border-gray-100 shadow-base overflow-hidden">
                            <div className="h-32 bg-linear-to-r from-green to-dark-green relative">
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                    <div className="w-24 h-24 rounded-lg border-4 border-white overflow-hidden shadow-lg bg-gray-200">
                                        {user.avatar?.url ? (
                                            <img 
                                                src={user.avatar.url} 
                                                alt={user.fullname} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <User size={40} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-16 pb-4 px-4 text-center">
                                <h2 className="text-xl font-bold text-dark">{user.fullname}</h2>
                                <p className="text-orange font-medium text-sm">@{user.username}</p>
                                
                                <div className="mt-8 space-y-2">
                                    <InfoItem icon={Mail} label="Email Address" value={user.email} />
                                    <InfoItem icon={Phone} label="Phone Number" value={user.phoneNumber} />
                                    <InfoItem icon={Globe} label="Joined Since" value={new Date(vendor?.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })} />
                                </div>
                            </div>
                        </div>

                        {/* Store Badge */}
                        <div className="bg-green rounded-lg p-4 text-white shadow-xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/3 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                           <Store className="mb-4 text-orange" size={32} />
                           <h3 className="text-sm font-medium text-gray-200 uppercase tracking-widest mb-1">Store Identity</h3>
                           <p className="text-2xl font-bold tracking-tight">{vendor?.storeName || "Anonymous Store"}</p>
                           <div className="mt-6 flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit">
                                <ShieldCheck size={14} className="text-orange" />
                                <span className="text-xs font-semibold text-gray-100 capitalize">{vendor?.accountStatus} Account</span>
                           </div>
                        </div>
                    </div>

                    {/* Main Content: Stats & Details */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Stripe Section */}
                        <div className="bg-white rounded-lg border border-gray-100 shadow-base p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <CreditCard className="text-orange" />
                                <h3 className="text-xl font-bold text-dark">Payment Configuration</h3>
                            </div>

                             {vendor?.stripeAccountId ? (
                                <div className="mt-6 flex items-center justify-between p-4 border border-dashed border-gray-200 rounded-lg max-[475px]:flex-col max-[475px]:gap-4 mb-4">
                                    <span className="text-sm font-medium text-gray-500">Stripe Account ID</span>
                                    <code className="bg-base-white px-3 py-1 rounded-md text-dark font-mono text-sm">{vendor.stripeAccountId}</code>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row max-md:text-center items-center gap-4 bg-orange/5 p-4 rounded-lg border border-orange/20 mb-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-dark mb-2">Stripe Account Required</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            To start accepting payments, you first need to create a Stripe connected account.
                                        </p>
                                    </div>
                                    <Button 
                                        onClick={() => setIsInitModalOpen(true)}
                                        className="bg-orange hover:bg-orange/90 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-orange/20 text-sm whitespace-nowrap"
                                    >
                                        Initialize Account
                                    </Button>
                                </div>
                            )}
                            
                            <div className="flex flex-col md:flex-row max-md:text-center items-center gap-4 bg-light-green/20 p-4 rounded-lg border border-light-green">
                                <div className="flex-1">
                                    <h4 className="font-bold text-dark mb-2">Stripe Onboarding</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Your payments are processed securely through Stripe. 
                                        {vendor?.stripeAccountOnboarded 
                                            ? " Your account is fully set up and ready to receive payouts." 
                                            : " You need to complete your Stripe onboarding to start receiving payments for your sales."}
                                    </p>
                                </div>

                                
                                {vendor?.stripeAccountOnboarded ? (
                                    <div className="flex items-center gap-2 bg-green text-white px-4 py-2 rounded-full text-sm font-bold">
                                        <CheckCircle size={16} />
                                        <span>Onboarded</span>
                                    </div>
                                ) : (
                                    <Button className="bg-orange hover:bg-orange/90 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-orange/20 text-sm whitespace-nowrap" onClick={() => mutation.mutate()}>
                                        Complete Onboarding
                                    </Button>
                                )}
                                
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="bg-white rounded-lg border border-gray-100 shadow-base p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Calendar className="text-orange" />
                                <h3 className="text-xl font-bold text-dark">Vendor Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Vendor Type</p>
                                    <p className="text-base font-semibold text-dark capitalize">{vendor?.vendorType}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Verification Status</p>
                                    <div className="flex items-center gap-1.5 text-green font-bold">
                                        <CheckCircle size={16} />
                                        <p className="text-base">Email Verified</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Store Phone</p>
                                    <p className="text-base font-semibold text-dark">{vendor?.phoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Last Updated</p>
                                    <p className="text-base font-semibold text-dark">{new Date(vendor?.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {isInitModalOpen && (<CreateAccountModal 
              
                onClose={() => setIsInitModalOpen(false)}
                userEmail={user.email}
            />)}
        </div>
    );
};

export default VendorProfile;
