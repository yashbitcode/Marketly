const mongoose = require("mongoose");
const { SUPPORT_QUERY_TYPES, REGEX } = require("../utils/constants");
const { mediaSchema } = require("../utils/baseSchemas");

const SupportTicketSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        min: [3, "Minimum length should be 3"],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email is required"],
        trim: true,
        match: [REGEX.email, "Invalid email"],
        unique: [true, "Email already exists"],
        trim: true,
    },
    queryType: {
        type: String,
        enum: {
            values: SUPPORT_QUERY_TYPES,
            message: "`{VALUE}` is not a valid value",
        },
        default: "general issue",
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        min: [10, "Minimum length should be 10"],
    },
    attachments: {
        type: [new mongoose.Schema(mediaSchema, {_id: false})],
        default: undefined
    }
});

const SupportTicket = mongoose.model("support-tickets", SupportTicketSchema);

module.exports = SupportTicket;