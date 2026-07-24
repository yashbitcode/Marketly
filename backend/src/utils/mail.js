import mailGenerator from "../config/mailgen/index.js";
import transporter from "../config/nodemailer/index.js";
import ApiError from "./api-error.js";

const sendMail = async (options) => {
    const { to, subject, emailContent } = options;

    try {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
            sender: {
                name: "Marketly",
                email: process.env.EMAIL_USER,
            },
            to: [
                {
                    email: to,
                },
            ],
            subject,
            htmlContent: emailContent,
        }),
    });


    console.log(res)
    return res;
    } catch(err) {
        console.log(err);
        throw new ApiError(500, err.message);
    }
    

    //     const { data, error } = await resend.emails.send({
    //     from: "Acme <onboarding@resend.dev>",
    //     to: [to],
    //     subject: subject,
    //     html: emailContent
    //   });

    //   if (error)  throw new ApiError(error.statusCode, error.message);

    //   return data;
    //     console.log(options);

    // const mail = {
    //     from:`"Marketly" <${process.env.EMAIL_USER}>`,
    //     to,
    //     subject,
    //     // text: emailText,
    //     html: emailContent,
    // };

    // try {
    //     const info = await transporter.sendMail(mail);
    //     return info;
    // } catch (e) {
    //     console.log(e);
    //     throw new ApiError(500, e.message);
    // }
};

const passwordResetMailContent = (fullname, passwordResetLink) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
</head>

<body style="margin:0;padding:0;background:#f5fdf7;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;background:#f5fdf7;">
<tr>
<td align="center">

<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.08);">

<tr>
<td style="background:#14532D;padding:28px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:28px;">
Marketly
</h1>
<p style="margin:10px 0 0;color:#DCFCE7;font-size:15px;">
Reset Your Password
</p>
</td>
</tr>

<tr>
<td style="padding:40px;">

<p style="margin-top:0;font-size:16px;">
Hi <strong>${fullname}</strong>,
</p>

<p style="font-size:16px;line-height:1.7;">
We received a request to reset the password for your account.
</p>

<p style="font-size:16px;line-height:1.7;">
No worries — this happens to the best of us.
</p>

<p style="margin-top:35px;font-size:16px;">
Click the button below to securely reset your password.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:30px auto;">
<tr>
<td bgcolor="#16A34A" style="border-radius:8px;">
<a
href="${passwordResetLink}"
target="_blank"
style="
display:inline-block;
padding:15px 34px;
color:#ffffff;
text-decoration:none;
font-size:16px;
font-weight:bold;
">
Reset Password
</a>
</td>
</tr>
</table>

<p style="margin-top:35px;font-size:15px;color:#4b5563;line-height:1.7;">
If you did not request a password reset, you can safely ignore this email.
</p>

<p style="font-size:15px;color:#4b5563;line-height:1.7;">
Your account will remain secure.
</p>

<hr style="margin:40px 0;border:none;border-top:1px solid #e5e7eb;">

<p style="font-size:13px;color:#6b7280;text-align:center;">
If the button above doesn't work, copy and paste this link into your browser:
</p>

<p style="text-align:center;word-break:break-all;">
<a
href="${passwordResetLink}"
style="color:#16A34A;text-decoration:none;font-size:13px;"
>
${passwordResetLink}
</a>
</p>

</td>
</tr>

<tr>
<td style="background:#DCFCE7;padding:20px;text-align:center;font-size:13px;color:#14532D;">
© ${new Date().getFullYear()} Marketly. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

const registrationMailContent = (fullname, loginLink) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to Marketly</title>
</head>

<body style="margin:0;padding:0;background:#F5FDF7;font-family:Arial,Helvetica,sans-serif;color:#1F2937;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;background:#F5FDF7;">
<tr>
<td align="center">

<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td style="background:#14532D;padding:28px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:28px;">
Marketly
</h1>

<p style="margin:10px 0 0;color:#DCFCE7;font-size:15px;">
Welcome to Marketly 🎉
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<p style="margin-top:0;font-size:16px;">
Hi <strong>${fullname}</strong>,
</p>

<p style="font-size:16px;line-height:1.7;">
Your account has been created successfully.
</p>

<p style="font-size:16px;line-height:1.7;">
You're all set to explore products, manage orders, track purchases, and enjoy everything Marketly has to offer.
</p>

<p style="margin-top:35px;font-size:16px;">
Click the button below to log in to your account.
</p>

<table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:30px auto;">
<tr>
<td bgcolor="#16A34A" style="border-radius:8px;">
<a
href="${loginLink}"
target="_blank"
style="
display:inline-block;
padding:15px 34px;
color:#ffffff;
text-decoration:none;
font-size:16px;
font-weight:bold;
">
Login to Your Account
</a>
</td>
</tr>
</table>

<p style="margin-top:35px;font-size:15px;color:#4B5563;line-height:1.7;">
If you did not create this account, please contact our support team immediately.
</p>

<hr style="margin:40px 0;border:none;border-top:1px solid #E5E7EB;">

<p style="font-size:13px;color:#6B7280;text-align:center;">
If the button above doesn't work, copy and paste this link into your browser:
</p>

<p style="text-align:center;word-break:break-all;">
<a
href="${loginLink}"
style="color:#16A34A;text-decoration:none;font-size:13px;"
>
${loginLink}
</a>
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#DCFCE7;padding:20px;text-align:center;font-size:13px;color:#14532D;">
<p style="margin:0 0 6px 0;font-weight:bold;">
Marketly
</p>

<p style="margin:0;">
© ${new Date().getFullYear()} Marketly. All rights reserved.
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

const registrationCodeMailContent = (fullname, verificationCode) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verify Your Account</title>
</head>

<body style="margin:0;padding:0;background:#F5FDF7;font-family:Arial,Helvetica,sans-serif;color:#1F2937;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;background:#F5FDF7;">
<tr>
<td align="center">

<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td style="background:#14532D;padding:28px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:28px;">
Marketly
</h1>

<p style="margin:10px 0 0;color:#DCFCE7;font-size:15px;">
Verify Your Account
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<p style="margin-top:0;font-size:16px;">
Hi <strong>${fullname}</strong>,
</p>

<p style="font-size:16px;line-height:1.7;">
Welcome to Marketly! To complete your registration, please use the verification code below.
</p>

<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
style="
margin:35px 0;
background:#DCFCE7;
border:2px dashed #16A34A;
border-radius:10px;
"
>
<tr>
<td
align="center"
style="padding:30px;"
>

<p
style="
margin:0;
font-size:14px;
color:#14532D;
font-weight:bold;
letter-spacing:1px;
text-transform:uppercase;
"
>
Verification Code
</p>

<p
style="
margin:18px 0 0;
font-size:38px;
font-weight:bold;
color:#16A34A;
letter-spacing:8px;
font-family:Courier New, monospace;
"
>
${verificationCode}
</p>

</td>
</tr>
</table>

<p style="font-size:15px;color:#4B5563;line-height:1.7;">
This verification code is valid for a limited time. For your security, please do not share this code with anyone.
</p>

<p style="font-size:15px;color:#4B5563;line-height:1.7;">
If you did not create a Marketly account, you can safely ignore this email.
</p>

<hr style="margin:40px 0;border:none;border-top:1px solid #E5E7EB;">

<p style="font-size:13px;color:#6B7280;text-align:center;">
Need help? Our support team is always here to assist you.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#DCFCE7;padding:20px;text-align:center;font-size:13px;color:#14532D;">

<p style="margin:0 0 6px 0;font-weight:bold;">
Marketly
</p>

<p style="margin:0;">
© ${new Date().getFullYear()} Marketly. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

const passwordChangedMailContent = (fullname) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Updated Successfully</title>
</head>

<body style="margin:0;padding:0;background:#F5FDF7;font-family:Arial,Helvetica,sans-serif;color:#1F2937;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;background:#F5FDF7;">
<tr>
<td align="center">

<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td style="background:#14532D;padding:28px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:28px;">
Marketly
</h1>

<p style="margin:10px 0 0;color:#DCFCE7;font-size:15px;">
Password Updated Successfully
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<p style="margin-top:0;font-size:16px;">
Hi <strong>${fullname}</strong>,
</p>

<p style="font-size:16px;line-height:1.7;">
This is a confirmation that your Marketly account password has been changed successfully.
</p>

<p style="font-size:16px;line-height:1.7;">
If you made this change, there's nothing else you need to do. Your account is now protected with your new password.
</p>

<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
style="
margin:35px 0;
background:#DCFCE7;
border-left:5px solid #16A34A;
border-radius:8px;
"
>
<tr>
<td style="padding:20px;">

<p style="margin:0;font-size:15px;color:#14532D;font-weight:bold;">
✓ Password Changed Successfully
</p>

<p style="margin:12px 0 0;font-size:15px;color:#374151;line-height:1.7;">
Your account credentials have been updated successfully. You can continue using your account as usual.
</p>

</td>
</tr>
</table>

<p style="font-size:15px;color:#4B5563;line-height:1.7;">
If you did <strong>not</strong> make this change, we recommend resetting your password immediately and contacting our support team as soon as possible.
</p>

<hr style="margin:40px 0;border:none;border-top:1px solid #E5E7EB;">

<p style="font-size:13px;color:#6B7280;text-align:center;">
This is an automated security notification from Marketly.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#DCFCE7;padding:20px;text-align:center;font-size:13px;color:#14532D;">

<p style="margin:0 0 6px 0;font-weight:bold;">
Marketly
</p>

<p style="margin:0;">
© ${new Date().getFullYear()} Marketly. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

const orderPlacedInvoiceMailContent = (fullname, orderId, invoiceUrl) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Order Has Been Placed Successfully</title>
</head>

<body style="margin:0;padding:0;background:#F5FDF7;font-family:Arial,Helvetica,sans-serif;color:#1F2937;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;background:#F5FDF7;">
<tr>
<td align="center">

<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td style="background:#14532D;padding:28px;text-align:center;">
<h1 style="margin:0;color:#FFFFFF;font-size:28px;">
Marketly
</h1>

<p style="margin:10px 0 0;color:#DCFCE7;font-size:15px;">
Your Order Has Been Placed Successfully 🎉
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<p style="margin-top:0;font-size:16px;">
Hi <strong>${fullname}</strong>,
</p>

<p style="font-size:16px;line-height:1.7;">
Thank you for shopping with <strong>Marketly</strong>! 🎉
</p>

<p style="font-size:16px;line-height:1.7;">
We're happy to let you know that your order has been placed successfully and is now being processed by our team.
</p>

<!-- Order Details -->
<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
style="
margin:35px 0;
background:#DCFCE7;
border-left:5px solid #16A34A;
border-radius:8px;
"
>
<tr>
<td style="padding:22px;">

<p style="margin:0;font-size:14px;color:#14532D;font-weight:bold;text-transform:uppercase;">
Order ID
</p>

<p style="margin:10px 0 0;font-size:24px;font-weight:bold;color:#16A34A;word-break:break-word;">
${orderId}
</p>

</td>
</tr>
</table>

<p style="font-size:16px;line-height:1.7;">
You can view or download your invoice by clicking the button below.
</p>

<!-- CTA -->
<table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:30px auto;">
<tr>
<td bgcolor="#16A34A" style="border-radius:8px;">
<a
href="${invoiceUrl}"
target="_blank"
style="
display:inline-block;
padding:15px 34px;
color:#FFFFFF;
text-decoration:none;
font-size:16px;
font-weight:bold;
">
View Invoice
</a>
</td>
</tr>
</table>

<p style="font-size:15px;color:#4B5563;line-height:1.7;">
We'll notify you as soon as your order is packed and shipped.
</p>

<p style="font-size:15px;color:#4B5563;line-height:1.7;">
If you have any questions regarding your order, our support team will be happy to help.
</p>

<hr style="margin:40px 0;border:none;border-top:1px solid #E5E7EB;">

<p style="font-size:13px;color:#6B7280;text-align:center;">
If the button above doesn't work, copy and paste this link into your browser.
</p>

<p style="text-align:center;word-break:break-all;">
<a
href="${invoiceUrl}"
style="color:#16A34A;text-decoration:none;font-size:13px;"
>
${invoiceUrl}
</a>
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#DCFCE7;padding:20px;text-align:center;font-size:13px;color:#14532D;">

<p style="margin:0 0 6px 0;font-weight:bold;">
Thank you for choosing Marketly ❤️
</p>

<p style="margin:0;">
© ${new Date().getFullYear()} Marketly. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

const refundSuccessfulMailContent = (orderId, refundId, amount) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Refund Processed Successfully</title>
</head>

<body style="margin:0;padding:0;background:#F5FDF7;font-family:Arial,Helvetica,sans-serif;color:#1F2937;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;background:#F5FDF7;">
<tr>
<td align="center">

<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td style="background:#14532D;padding:28px;text-align:center;">
<h1 style="margin:0;color:#FFFFFF;font-size:28px;">
Marketly
</h1>

<p style="margin:10px 0 0;color:#DCFCE7;font-size:15px;">
Refund Processed Successfully
</p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<p style="margin-top:0;font-size:16px;">
Hello,
</p>

<p style="font-size:16px;line-height:1.7;">
We're writing to let you know that your refund request has been processed successfully.
</p>

<p style="font-size:16px;line-height:1.7;">
Below are the details of your refund for your reference.
</p>

<!-- Refund Details -->
<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
style="
margin:35px 0;
background:#DCFCE7;
border-left:5px solid #16A34A;
border-radius:8px;
"
>

<tr>
<td style="padding:22px;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="8">

<tr>
<td style="font-weight:bold;color:#14532D;width:35%;">
Order ID
</td>

<td style="color:#374151;word-break:break-word;">
${orderId}
</td>
</tr>

<tr>
<td style="font-weight:bold;color:#14532D;">
Refund ID
</td>

<td style="color:#374151;word-break:break-word;">
${refundId}
</td>
</tr>

<tr>
<td style="font-weight:bold;color:#14532D;">
Refund Amount
</td>

<td style="font-size:18px;font-weight:bold;color:#16A34A;">
₹${amount}
</td>
</tr>

</table>

</td>
</tr>

</table>

<p style="font-size:15px;color:#4B5563;line-height:1.7;">
The refunded amount should reflect in your original payment method within a few business days, depending on your bank or payment provider.
</p>

<p style="font-size:15px;color:#4B5563;line-height:1.7;">
If you have any questions regarding this refund, feel free to contact our support team. We'll be happy to assist you.
</p>

<p style="font-size:15px;color:#4B5563;line-height:1.7;">
Thank you for choosing Marketly. We look forward to serving you again.
</p>

<hr style="margin:40px 0;border:none;border-top:1px solid #E5E7EB;">

<p style="font-size:13px;color:#6B7280;text-align:center;">
This is an automated notification regarding your refund.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#DCFCE7;padding:20px;text-align:center;font-size:13px;color:#14532D;">

<p style="margin:0 0 6px 0;font-weight:bold;">
Marketly
</p>

<p style="margin:0;">
© ${new Date().getFullYear()} Marketly. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

// const passwordResetMailContent = (fullname, passwordResetLink) => ({
//     body: {
//         name: fullname,
//         title: "Reset Your Password",
//         intro: [
//             "We received a request to reset the password for your account.",
//             "No worries — this happens to the best of us.",
//         ],
//         action: {
//             instructions:
//                 "Click the button below to securely reset your password:",
//             button: [
//                 {
//                     color: "#DC4D2F",
//                     text: "Reset Password",
//                     link: passwordResetLink,
//                 },
//             ],
//         },
//         outro: [
//             "If you did not request a password reset, you can safely ignore this email.",
//             "Your account will remain secure.",
//         ],
//     },
// });

// const registrationMailContent = (fullname, loginLink) => ({
//     body: {
//         name: fullname,
//         title: "Welcome to Marketly 🎉",
//         intro: [
//             "Your account has been created successfully.",
//             "You’re all set to explore products, manage orders, and more.",
//         ],
//         action: {
//             instructions: "Click below to log in to your account:",
//             button: [
//                 {
//                     color: "#22BC66",
//                     text: "Login to Your Account",
//                     link: loginLink,
//                 },
//             ],
//         },
//         outro: "If you did not create this account, please contact our support team immediately.",
//     },
// });

// const registrationCodeMailContent = (fullname, verificationCode) => ({
//     body: {
//         name: fullname,
//         title: "Verify Your Account",
//         intro: "Use the verification code below to complete your registration:",
//         table: {
//             data: [
//                 {
//                     "Verification Code": verificationCode,
//                 },
//             ],
//         },
//         outro: [
//             "This code is valid for a limited time.",
//             "If you did not create this account, please ignore this email.",
//         ],
//     },
// });

// const passwordChangedMailContent = (fullname) => ({
//     body: {
//         name: fullname,
//         title: "Password Updated Successfully",
//         intro: [
//             "This is a confirmation that your account password has been changed successfully.",
//             "If you made this change, no further action is required.",
//         ],
//         outro: "If you did not make this change, please contact our support team immediately.",
//     },
// });

// const orderPlacedInvoiceMailContent = (fullname, orderId, invoiceUrl) => ({
//     body: {
//         name: fullname,
//         title: "Your Order Has Been Placed Successfully 🎉",
//         intro: [
//             `Thank you for your purchase, ${fullname}!`,
//             `We’re happy to inform you that your order with Order ID ${orderId} has been placed successfully.`,
//         ],
//         action: {
//             instructions:
//                 "You can view or download your invoice by clicking the button below:",
//             button: {
//                 color: "#22BC66",
//                 text: "View Invoice",
//                 link: invoiceUrl,
//             },
//         },
//         outro: [
//             "If you have any questions regarding your order, feel free to reach out to our support team.",
//             "Thank you for shopping with us!",
//         ],
//     },
// });

// const refundSuccessfulMailContent = (orderId, refundId, amount) => ({
//     body: {
//         title: "Your Refund Has Been Processed Successfully",
//         intro: [
//             `We wanted to let you know that your refund request has been successfully processed.`,
//             `Here are the refund details for your reference:`,
//             `• Order ID: ${orderId}`,
//             `• Refund ID: ${refundId}`,
//             `• Refunded Amount: ₹${amount}`,
//         ],
//         outro: [
//             "The refunded amount should reflect in your original payment method within sometime, depending on your bank or payment provider.",
//             "If you have any questions or need further assistance, feel free to contact our support team.",
//             "We appreciate your patience and hope to serve you again soon!",
//         ],
//     },
// });

export {
    sendMail,
    passwordResetMailContent,
    registrationMailContent,
    registrationCodeMailContent,
    passwordChangedMailContent,
    orderPlacedInvoiceMailContent,
    refundSuccessfulMailContent,
};
