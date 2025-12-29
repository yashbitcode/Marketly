const ApiResponse = require("../utils/api-response");
const { asyncHandler } = require("../utils/asyncHandler");
const userService = require("../services/user.service");

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    
    const user = await userService.updateUserData(_id, req.body);

    res.json(user);
});

module.exports = {
    updateUser
};
