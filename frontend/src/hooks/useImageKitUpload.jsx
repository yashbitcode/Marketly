import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/react";
import { useState } from "react";
import { MediaApi } from "../apis";

const useImageKitUpload = () => {
    const [progress, setProgress] = useState(0);
    const abortController = new AbortController();

    const authenticator = async (totalCounts) => {
        try {
            const response = await MediaApi.getAuthParams(totalCounts);

            if (!response.data.success) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            const params = (await response?.data?.data) || [];
            return params;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const handleUpload = async (fileInput, customMetadata, folder) => {
        if (!fileInput || fileInput?.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        let authParams;
        try {
            authParams = await authenticator(fileInput?.length);
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }

        try {
            const data = Array.from(fileInput).map(async (file, idx) => {
                const {
                    name: filename,
                    fileId,
                    thumbnailUrl,
                    url,
                } = await upload({
                    ...authParams[idx],
                    file,
                    folder,
                    fileName: file.name,
                    customMetadata,
                    onProgress: (event) => {
                        setProgress((event.loaded / event.total) * 100);
                    },
                    abortSignal: abortController.signal,
                });

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
