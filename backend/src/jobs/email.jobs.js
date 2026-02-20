import { sendMail } from "../utils/mail.js";

const sendMailJob = async (job) => {
    const emailOptions = job.data;
    const email = sendMail(emailOptions);

    return email;
};

export { sendMailJob };
