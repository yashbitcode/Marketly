class AddressService {
    async addAddress(payload, fieldsSelection = {}) {
        const addressCnt = await Address.countDocuments({ userId: payload.userId });

        if (!addressCnt) payload.isDefault = true;

        const address = new Address(payload);

        await address.save();

        return address;
    }
}

module.exports = new AddressService();
