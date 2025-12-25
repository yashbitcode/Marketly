const { asyncHandler } = require("../utils/asyncHandler");
const Address = require("../models/address.model");
const ApiResponse = require("../utils/api-response");
const addressService = require("../services/address.service");

const addAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    req.body.userId = _id;

    const address = await addressService.addAddress(req.body);

    res.json(new ApiResponse(201, address, "Address added successfully"));
});

module.exports = {
    addAddress,
};
