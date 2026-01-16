const { sendMail } = require("../utils/mail");

const sendMailJob = async (job) => {
    const emailOptions = job.data;
    const email = sendMail(emailOptions);

    return email;
};

module.exports = {
    sendMailJob,
};
