import mailGenerator from "../config/mailgen/index.js";
import transporter from "../config/nodemailer/index.js";

const sendMail = async (options) => {
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
        const info = await transporter.sendMail(mail);
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
            "No worries — this happens to the best of us.",
        ],
        action: {
            instructions:
                "Click the button below to securely reset your password:",
            button: [
                {
                    color: "#DC4D2F",
                    text: "Reset Password",
                    link: passwordResetLink,
                },
            ],
        },
        outro: [
            "If you did not request a password reset, you can safely ignore this email.",
            "Your account will remain secure.",
        ],
    },
});

const registrationMailContent = (fullname, loginLink) => ({
    body: {
        name: fullname,
        title: "Welcome to Marketly 🎉",
        intro: [
            "Your account has been created successfully.",
            "You’re all set to explore products, manage orders, and more.",
        ],
        action: {
            instructions: "Click below to log in to your account:",
            button: [
                {
                    color: "#22BC66",
                    text: "Login to Your Account",
                    link: loginLink,
                },
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
                    "Verification Code": verificationCode,
                },
            ],
        },
        outro: [
            "This code is valid for a limited time.",
            "If you did not create this account, please ignore this email.",
        ],
    },
});

const passwordChangedMailContent = (fullname) => ({
    body: {
        name: fullname,
        title: "Password Updated Successfully",
        intro: [
            "This is a confirmation that your account password has been changed successfully.",
            "If you made this change, no further action is required.",
        ],
        outro: "If you did not make this change, please contact our support team immediately.",
    },
});

const orderPlacedInvoiceMailContent = (fullname, orderId, invoiceUrl) => ({
    body: {
        name: fullname,
        title: "Your Order Has Been Placed Successfully 🎉",
        intro: [
            `Thank you for your purchase, ${fullname}!`,
            `We’re happy to inform you that your order with Order ID ${orderId} has been placed successfully.`,
        ],
        action: {
            instructions:
                "You can view or download your invoice by clicking the button below:",
            button: {
                color: "#22BC66",
                text: "View Invoice",
                link: invoiceUrl,
            },
        },
        outro: [
            "If you have any questions regarding your order, feel free to reach out to our support team.",
            "Thank you for shopping with us!",
        ],
    },
});

const refundSuccessfulMailContent = (orderId, refundId, amount) => ({
    body: {
        title: "Your Refund Has Been Processed Successfully",
        intro: [
            `We wanted to let you know that your refund request has been successfully processed.`,
            `Here are the refund details for your reference:`,
            `• Order ID: ${orderId}`,
            `• Refund ID: ${refundId}`,
            `• Refunded Amount: ₹${amount}`,
        ],
        outro: [
            "The refunded amount should reflect in your original payment method within sometime, depending on your bank or payment provider.",
            "If you have any questions or need further assistance, feel free to contact our support team.",
            "We appreciate your patience and hope to serve you again soon!",
        ],
    },
});

export {
    sendMail,
    passwordResetMailContent,
    registrationMailContent,
    registrationCodeMailContent,
    passwordChangedMailContent,
    orderPlacedInvoiceMailContent,
    refundSuccessfulMailContent,
};
