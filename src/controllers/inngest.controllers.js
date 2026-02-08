const { inngest } = require("../inngest");
const { asyncHandler } = require("../utils/asyncHandler");

const test = asyncHandler(async (req, res, next) => {
    await inngest
        .send({
            name: "test/hello.world",
            data: {
                email: "yash@bit.com",
            },
        })
        .catch((err) => next(err));

    res.json({ message: "Event sent!" });
});

// const sendMail = asyncHandler(async )

module.exports = {
    test,
};
