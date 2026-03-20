import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/react";
import { useState } from "react";
import { MediaApi } from "../apis";
import { useMutation } from "@tanstack/react-query";
import { ErrorToast } from "../utils/toasts";

const useImageKitUpload = () => {
    const [progress, setProgress] = useState(0);
    const abortController = new AbortController();
    const mutation = useMutation({
        mutationFn: (totalCounts) => MediaApi.getAuthParams(totalCounts),
        onSuccess: async (res) => {
            if (!res.success) {
                const errorText = await res.text();
                ErrorToast(errorText);
                throw new Error(`Request failed with status ${res.status}: ${errorText}`);
            }

            return res?.data || [];
        },
        onError: (err) => {
            ErrorToast(err?.response?.data?.message || "Something went wrong");
            throw new Error(err?.response?.data?.message || "Something went wrong");
        },
    });

    const handleUpload = async (fileInput, customMetadata, folder) => {
        if (!fileInput || fileInput?.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        let authParams;
        try {
            authParams = await mutation.mutateAsync(fileInput?.length);
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }
        console.log(authParams.data)
        try {
            const data = Array.from(fileInput).map(async (file, idx) => {
                const {
                    name: filename,
                    fileId,
                    thumbnailUrl,
                    url,
                } = await upload({
                    ...authParams?.data[idx],
                    file,
                    folder,
                    fileName: file.name,
                    customMetadata,
                    onProgress: (event) => {
                        setProgress((event.loaded / event.total) * 100);
                    },
                    abortSignal: abortController.signal,
                });

                console.log({
                    name: filename,
                    fileId,
                    thumbnailUrl,
                    url,
                })

                return {
                    filename,
                    fileId,
                    thumbnailUrl,
                    url,
                };
            });

            return data;
        } catch (error) {
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                console.error("Upload error:", error);
            }
        }
    };

    return { handleUpload, progress };
};

export default useImageKitUpload;
