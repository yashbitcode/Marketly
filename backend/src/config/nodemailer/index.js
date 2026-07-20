import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
  port: 465,
  secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
});

(async () => {
    await transporter.verify();
    console.log("Transporter Connection Esatb.")
})()


export default transporter;

