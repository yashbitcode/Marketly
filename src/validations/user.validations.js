const z = require("zod");

const updateUserValidations = z
    .object({
        fullname: z.string().min(3, "Minimum length should be 3"),
        phoneNumber: z
            .string()
            .regex(
                /^(\+\d{1,2}\s?)?1?[-.\s]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                "Invalid Phone Number",
            ),
        avatar: z.url({
            error: (iss) => iss.input && "Invalid avatar URL",
        }),
    })
    .partial();

module.exports = {
    updateUserValidations,
};
