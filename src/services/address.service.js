const { default: mongoose } = require("mongoose");
const Address = require("../models/address.models");

class AddressService {
    async getAllAddressesByUserId(userId) {
        const allAddresses = await Address.find({ userId });
        return allAddresses;
    }

    async addAddress(payload) {
        const addressCnt = await Address.countDocuments({
            userId: payload.userId,
        });

        if (!addressCnt) payload.isDefault = true;

        const address = new Address(payload);

        await address.save();

        return address;
    }

    async deleteAddressById(addressId, userId) {
        const address = await Address.findOneAndDelete({
            _id: addressId,
            userId,
        });
        return address;
    }

    async updateAddressById(addressId, userId, payload) {
        const address = await Address.findOneAndUpdate(
            {
                _id: addressId,
                userId,
            },
            payload,
            {new: true, runValidators: true}
        );
        return address;
    }

    async getAddressById(addressId, userId) {
        const address = await Address.findOne({ userId, _id: addressId });

        return address;
    }

    async markAddressAsDefault(addressId, userId) {
        await Address.updateMany(
            { userId },
            [
                {
                    $set: {
                        isDefault: {
                            $cond: [
                                {
                                    $eq: [
                                        "$_id",
                                        new mongoose.Types.ObjectId(addressId),
                                    ],
                                },
                                true,
                                false,
                            ],
                        },
                    },
                },
            ],
            { updatePipeline: true },
        );
    }
}

module.exports = new AddressService();
