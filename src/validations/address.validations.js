const { addressValidations } = require("../utils/baseValidations");

const addAddressValidations = addressValidations.strict();
const updateAddressValidations = addressValidations.partial();

module.exports = {
    addAddressValidations,
    updateAddressValidations
};
