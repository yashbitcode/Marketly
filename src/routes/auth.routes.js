const { Router } = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { registerValidations } = require("../validations/auth.validations");
const { validate } = require("../middlewares/validate.middlewares");
const User = require("../models/user.models");
const router = Router();

router.post(
    "/register",
    validate(registerValidations),
    asyncHandler(async (req, res) => {
        const {fullname,
            email,
            password,
            avatar,
            username} = req.body;
        const { sessionId, hashedSessionId, token, expiryDate } =
            User.generateTokens();

        const user = new User({
            fullname,
            email,
            password,
            avatar,
            username,
            emailVerificationToken: token,
            emailVerificationSessionId: hashedSessionId,
            emailVerificationTokenExpiry: expiryDate,
        });

        await user.save();

        res.json(user);
    }),
);

module.exports = router;
