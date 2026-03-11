import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addSupportTicketClient } from "../../../shared/validations/supportTicket.validations";
import { Button, Container, Dropdown, Input, Textarea } from "../components/common";
import { SUPPORT_QUERY_TYPES } from "../../../shared/constants";
import { useImageKitUpload } from "../hooks";
import Loader from "../components/loadings/Loader";
import { useState } from "react";
import toast from "react-hot-toast";
import { SupportApi } from "../apis";
import { ErrorToast, SuccessToast } from "../utils/toasts";
import { useMutation } from "@tanstack/react-query";

const Support = () => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(addSupportTicketClient),
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const { fullname, email, message, queryType, files } = data;
            const payload = { fullname, email, message, queryType };

            if (files && files?.length !== 0) {
                const uploadPromises = await handleUpload(
                    files,
                    { email_id: email },
                    "/support-attachments",
                );

                const attachmentsData = await Promise.all(uploadPromises);
                payload.attachments = attachmentsData;
            }

            const res = await SupportApi.createSupportTicket(payload);

            return res;
        },
        onSuccess: (res) => {
            SuccessToast(res.message);
            reset();
        },
        onError: (err) => ErrorToast(err?.response?.data?.message || "Something went wrong"),
    });

    const { handleUpload } = useImageKitUpload();

    const onSubmit = async (data) => {
        mutation.mutate(data);
    };

    return (
        <Container className="font-inter my-10 max-w-xl w-full mx-auto px-3">
            <h1 className="text-4xl text-center">Let's Connect</h1>
            <form className="w-full flex flex-col gap-3 mt-8" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Fullname"
                    placeholder={"Fullname"}
                    {...register("fullname")}
                    error={errors?.fullname?.message}
                />
                <Input
                    label="Email Address"
                    placeholder={"Email Address"}
                    {...register("email")}
                    error={errors?.email?.message}
                />
                <Dropdown
                    label="Query Type"
                    placeholder={"Query Type"}
                    watch={watch}
                    {...register("queryType")}
                    error={errors?.queryType?.message}
                    dropdownList={SUPPORT_QUERY_TYPES}
                    setVal={setValue}
                />

                <Textarea
                    label="Message"
                    placeholder={"Message"}
                    {...register("message")}
                    error={errors?.message?.message}
                />

                <Input
                    label="Attachments"
                    type="file"
                    multiple
                    accept="image/jpeg, image/jpg, image/webp, image/png"
                    {...register("files")}
                    error={errors?.files?.message}
                />

                <Button
                    type="submit"
                    className="mt-2 flex justify-center items-center gap-4 py-2.5 bg-green rounded-[10px]"
                >
                    {mutation.isPending ? (
                        <>
                            <div className="w-fit">
                                <Loader />
                            </div>
                            Loading...
                        </>
                    ) : (
                        "Submit"
                    )}
                </Button>
            </form>
        </Container>
    );
};

export default Support;
