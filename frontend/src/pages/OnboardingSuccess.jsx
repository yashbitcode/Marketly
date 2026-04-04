import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from "react-router";
import { CheckCircle, ShieldCheck, ExternalLink, ArrowRight, Loader2, CreditCard } from "lucide-react";
import { UserApi } from "../apis";
import { Container, Button } from "../components/common";

const OnboardingSuccess = () => {
    const queryClient = useQueryClient();
    
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["user"],
        queryFn: UserApi.me,
        // Refetch on mount to ensure we have the latest onboarding status
        refetchOnMount: true,
    });

    useEffect(() => {
        // Sync the user cache when this page loads
        queryClient.invalidateQueries(["user"]);
    }, [queryClient]);

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-orange animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Verifying your onboarding status...</p>
            </div>
        );
    }

    console.log(user, isLoading, isError)

    if (isError || !user) {
        return <Navigate to="/login" />;
    }

    const vendor = user.data.vendorId;
    const isOnboarded = vendor?.stripeAccountOnboarded;

    if (!isOnboarded) {
        return <Navigate to="/vendor/profile" />;
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-orange/5 border border-gray-100 overflow-hidden ring-1 ring-black/5">
                {/* Header Section */}
                <div className="relative h-32 bg-linear-to-br from-green to-dark-green flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <CheckCircle className="size-12 text-green" strokeWidth={2.5} />
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 size-12 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-4 left-4 size-16 bg-orange/10 rounded-full blur-2xl"></div>
                </div>

                {/* Content Section */}
                <div className="p-4 pt-6 text-center">
                    <h1 className="text-2xl font-bold text-dark mb-2 max-sm:text-xl">Onboarding Successful!</h1>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Your Stripe account has been successfully linked and verified. You are now ready to start selling on Marketly.
                    </p>

                    {/* Status Card */}
                    <div className="bg-light-green/20 rounded-2xl p-4 border border-light-green mb-8 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck size={64} className="text-green" />
                        </div>
                        
                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex justify-between items-center text-sm max-sm:flex-col gap-2">
                                <span className="text-gray-500 font-medium font-inter">Status</span>
                                <span className="flex items-center gap-1.5 text-green font-bold bg-white px-3 py-1 rounded-full shadow-sm border border-green/10">
                                    <div className="w-2 h-2 rounded-full bg-green animate-pulse"></div>
                                    Fully Onboarded
                                </span>
                            </div>
                            
                            <div className="h-px bg-green/10 w-full"></div>
                            
                            <div className="flex flex-col gap-1.5 items-start">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <CreditCard size={12} className="text-green" />
                                    Stripe Account ID
                                </span>
                                <div className="w-full flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-green/10 shadow-sm group/id cursor-pointer overflow-hidden">
                                    <code className="text-dark font-mono text-sm truncate">
                                        {vendor?.stripeAccountId || "Not available"}
                                    </code>
                                    <ShieldCheck className="text-green max-sm:hidden shrink-0 ml-2" size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <Link to="/vendor/products/add" className="w-full py-4 bg-orange hover:bg-orange/90 text-white font-bold rounded-2xl shadow-xl shadow-orange/20 text-sm flex items-center justify-center gap-2 group transition-all">
                            Add Your First Product
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <Link to="/vendor/profile" className="w-full py-4 bg-white hover:bg-gray-50 text-dark border border-gray-200 font-semibold rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors">
                            View Vendor Profile
                            <ExternalLink size={16} className="text-gray-400" />
                        </Link>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="px-8 pb-8 text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        Securely processed by Stripe Payments
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OnboardingSuccess;
