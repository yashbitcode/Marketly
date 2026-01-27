const { asyncHandler } = require("../utils/asyncHandler");
const Address = require("../models/address.models");
const ApiResponse = require("../utils/api-response");
const addressService = require("../services/address.service");
const ApiError = require("../utils/api-error");
const { pubClient: redisClient } = require("../config/redis/connection");

const getAllUserAddresses = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    let allAddresses = await redisClient.get(`user:addresses:${_id}`);

    if (allAddresses)
        return res.json(
            new ApiResponse(
                200,
                allAddresses,
                "All addresses fetched successfully",
            ),
        );

    allAddresses = await addressService.getAllAddressesByUserId(_id);
    
    await redisClient.set(`user:addresses:${_id}`, JSON.stringify(allAddresses));
    await redisClient.expire(`user:addresses:${_id}`, 60 * 60 * 24);

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

    await redisClient.del(`user:addresses:${_id}`);

    res.json(new ApiResponse(201, address, "Address added successfully"));
});

const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const { _id } = req.user;

    const address = await addressService.deleteAddressById(addressId, _id);

    if (!address) throw new ApiError(404, "Address not found");

    await redisClient.del(`user:addresses:${_id}`);

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

    await redisClient.del(`user:addresses:${_id}`);

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

    await redisClient.del(`user:addresses:${_id}`);

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
    markDefaultAddress,
};
