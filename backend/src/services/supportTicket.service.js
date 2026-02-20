import SupportTicket from "../models/supportTicket.models.js";
import { getPaginationBasePipeline } from "../utils/helpers.js";

class SupportTicketService {
    async getAll(matchStage = {}, page = 1) {
        const basePagination = getPaginationBasePipeline(+page);

        const [allTickets] = await SupportTicket.aggregate([
            {
                $match: matchStage,
            },
            ...basePagination,
        ]);

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

export default new SupportTicketService();
