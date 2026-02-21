import { addressValidations } from "../baseValidations.js";

const addAddressValidations = addressValidations.strict();
const updateAddressValidations = addressValidations.partial();

export { addAddressValidations, updateAddressValidations };
