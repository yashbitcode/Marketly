const z = require("zod");
const { REGEX } = require("../utils/constants");
const { baseMediaValidations } = require("../utils/baseValidations");

const updateUserValidations = baseMediaValidations.extend({
        fullname: z.string().min(3, "Minimum length should be 3"),
        phoneNumber: z
            .string()
            .regex(REGEX.phoneNumber, "Invalid Phone Number"),
        avatar: baseMediaValidations
    })
    .partial();

module.exports = {
    updateUserValidations,
};
