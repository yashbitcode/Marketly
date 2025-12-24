const z = require("zod");

const registerValidations = z
    .object({
        fullname: z
            .string({
                error: (iss) => !iss.input && "Fullname is required",
            })
            .min(3, "Minimum length should be 3"),
        email: z
            .email({
                error: (iss) =>
                    !iss.input ? "Email is required" : "Invalid email",
            })
            .lowercase()
            .trim(),
        password: z
            .string({
                error: (iss) => !iss.input && "Password is required",
            })
            .regex(
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number",
            ),
        confirmPassword: z.string({
            error: (iss) => !iss.input && "Confirm password is required",
        }),
        avatar: z
            .url({
                error: (iss) =>
                    !iss.input
                        ? "Avatar URL is required"
                        : "Invalid avatar URL",
            })
            .optional(),
        username: z
            .string({
                error: (iss) => !iss.input && "Username is required",
            })
            .min(3, "Minimum length should be 3")
            .max(10, "Maximum length can be 10")
            .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "Invalid username"),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: "Confirm password doesn't match",
        path: ["confirmPassword"],
    });

const loginValidations = z
    .object({
        email: z
            .email({
                error: (iss) =>
                    !iss.input ? "Email is required" : "Invalid email",
            })
            .lowercase()
            .trim(),
        password: z
            .string({
                error: (iss) => !iss.input && "Password is required",
            })
            .regex(
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number",
            ),
        confirmPassword: z.string({
            error: (iss) => !iss.input && "Confirm password is required",
        }),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: "Confirm password doesn't match",
        path: ["confirmPassword"],
    });

const changePasswordValidations = z
    .object({
        oldPassword: z
            .string({
                error: (iss) => !iss.input && "Old password is required",
            })
            .regex(
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number",
            ),
        newPassword: z
            .string({
                error: (iss) => !iss.input && "New password is required",
            })
            .regex(
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number",
            ),
        confirmPassword: z.string({
            error: (iss) => !iss.input && "New password is required",
        }),
    })
    .refine(
        ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
        {
            message: "Confirm password doesn't match",
            path: ["confirmPassword"],
        },
    );

module.exports = {
    registerValidations,
    loginValidations,
    changePasswordValidations,
};
