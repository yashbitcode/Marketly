const SupportTicket = require("../models/supportTicket.models");
const { PAGINATION_LIMIT } = require("../utils/constants");

class SupportTicketService {
    async getAll(filters, page) {
        const allTickets = await SupportTicket.find(filters)
            .skip(PAGINATION_LIMIT * (page - 1))
            .limit(PAGINATION_LIMIT)
            .sort({
                createdAt: -1,
            });
        
            return allTickets;
    }

    async createTicket(payload) {
        const { fullname, email, queryType, message, attachments } = payload;

        const ticket = new SupportTicket({
            fullname,
            email,
            queryType,
            message,
            attachments,
        });

        await ticket.save();

        return ticket;
    }
}

module.exports = new SupportTicketService();