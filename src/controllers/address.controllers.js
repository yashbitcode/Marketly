const { asyncHandler } = require("../utils/asyncHandler");
const Address = require("../models/address.model");
const ApiResponse = require("../utils/api-response");
const addressService = require("../services/address.service");
const ApiError = require("../utils/api-error");

const getAllUserAddresses = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const allAddresses = await addressService.getAllAddressesByUserId(_id);

    res.json(
        new ApiResponse(
            200,
            allAddresses,
            "All addresses fetched successfully",
        ),
    );
});

const addAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    req.body.userId = _id;

    const address = await addressService.addAddress(req.body);

    res.json(new ApiResponse(201, address, "Address added successfully"));
});

const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const { _id } = req.user;

    const address = await addressService.deleteAddressById(addressId, _id);

    if (!address) throw new ApiError(404, "Address not found");

    res.json(
        new ApiResponse(200, { addressId }, "Address deleted successfully"),
    );
});

const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const { _id } = req.user;
    const payload = req.body;

    const updatedAddress = await addressService.updateAddressById(
        addressId,
        _id,
        payload,
    );

    if (!updatedAddress) throw new ApiError(404, "Address not found");

    res.json(
        new ApiResponse(200, updatedAddress, "Address updated successfully"),
    );
});

const markDefaultAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { addressId } = req.params;

    const address = await addressService.getAddressById(addressId, _id);

    if (!address) throw new ApiError(404, "Address not found");

    await addressService.markAddressAsDefault(addressId, _id);

    res.json(
        new ApiResponse(
            200,
            { addressId },
            "Address marked default successfully",
        ),
    );
});

module.exports = {
    getAllUserAddresses,
    addAddress,
    deleteAddress,
    updateAddress,
    markDefaultAddress
};
