const Mailgen = require("mailgen");
const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Marketly",
            link: "https://taskmanager.example.com"
        },
    });

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    const { from, to, subject, emailContent } = options;

    const emailHtml = mailGenerator.generate(emailContent);
    const emailText = mailGenerator.generatePlaintext(emailContent);

    const mail = {
        from,
        to,
        subject,
        text: emailText,
        html: emailHtml,
    };

    try {
        const info = transporter.sendMail(mail);
        return info;
    } catch (e) {
        throw new ApiError();
    }
};

const passwordResetMailContent = (fullname, passwordResetLink) => ({
    body: {
        name: fullname,
        title: "Reset Your Password",
        intro: [
            "We received a request to reset the password for your account.",
            "No worries — this happens to the best of us."
        ],
        action: {
            instructions: "Click the button below to securely reset your password:",
            button: [
                {
                    color: "#DC4D2F",
                    text: "Reset Password",
                    link: passwordResetLink,
                }
            ],
        },
        outro: [
            "If you did not request a password reset, you can safely ignore this email.",
            "Your account will remain secure."
        ],
    },
});

const registrationMailContent = (fullname, loginLink) => ({
    body: {
        name: fullname,
        title: "Welcome to Marketly 🎉",
        intro: [
            "Your account has been created successfully.",
            "You’re all set to explore products, manage orders, and more."
        ],
        action: {
            instructions: "Click below to log in to your account:",
            button: [
                {
                    color: "#22BC66",
                    text: "Login to Your Account",
                    link: loginLink,
                }
            ],
        },
        outro: "If you did not create this account, please contact our support team immediately.",
    },
});

const registrationCodeMailContent = (fullname, verificationCode) => ({
    body: {
        name: fullname,
        title: "Verify Your Account",
        intro: "Use the verification code below to complete your registration:",
        table: {
            data: [
                {
                    "Verification Code": verificationCode
                }
            ]
        },
        outro: [
            "This code is valid for a limited time.",
            "If you did not create this account, please ignore this email."
        ],
    },
});

const passwordChangedMailContent = (fullname) => ({
    body: {
        name: fullname,
        title: "Password Updated Successfully",
        intro: [
            "This is a confirmation that your account password has been changed successfully.",
            "If you made this change, no further action is required."
        ],
        outro: "If you did not make this change, please contact our support team immediately.",
    },
});


module.exports = {
    sendMail,
    passwordResetMailContent,
    registrationMailContent,
    registrationCodeMailContent,
    passwordChangedMailContent
};
