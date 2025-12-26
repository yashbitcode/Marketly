const Address = require("../models/address.model");

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
        const address = await Address.findOneAndUpdate({
            _id: addressId,
            userId,
        }, payload);
        return address;
    }
}

module.exports = new AddressService();
