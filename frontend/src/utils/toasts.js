import toast from "react-hot-toast";

export const ErrorToast = (errorMsg) => {
    toast.error(errorMsg, {
        position: "top-center",
    });
};

export const SuccessToast = (successMsg) => {
    toast.success(successMsg, {
        position: "top-center",
    });
};
