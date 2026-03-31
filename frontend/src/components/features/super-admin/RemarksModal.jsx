import { X, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { Button, Textarea } from "../../common";
import { useForm } from "react-hook-form";

const RemarksModal = ({ status, onConfirm, onClose }) => {
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            remarks: ""
        }
    })

    const isApprove = status === "accepted";

    return (
        <form className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-110 px-4 font-inter" onSubmit={handleSubmit((data) => onConfirm(data.remarks))}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className={`p-6 flex justify-between items-center text-white ${isApprove ? "bg-green-500" : "bg-red-500"}`}>
                    <div className="flex items-center gap-3">
                        {isApprove ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <h3 className="text-xl font-bold tracking-tight">
                            {isApprove ? "Approve Application" : "Reject Application"}
                        </h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <MessageSquare size={14} />
                            Administrative Remarks
                        </label>
                        <Textarea 
                            {...register("remarks", {
                                required: "Remarks are required",
                                minLength: {
                                    value: 10,
                                    message: "Minimum length should be 10"
                                }
                            })}
                            error={errors.remarks?.message}
                            placeholder={isApprove ? "e.g. Welcome to the platform! Great business model." : "e.g. Documentation incomplete, please re-upload valid ID."}
                            className="min-h-[120px] focus:ring-orange/20"
                        />
                        <p className="text-[10px] text-gray-400 italic">
                            These remarks will be visible to the vendor in their application status.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all border-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className={`flex-1 py-3 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg border-none ${
                            isApprove 
                            ? "bg-green-500 hover:bg-green-600 shadow-green-500/20" 
                            : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                        }`}
                    >
                        Confirm {isApprove ? "Approval" : "Rejection"}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default RemarksModal;
