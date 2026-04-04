import supportTicketService from "../services/supportTicket.service.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllTickets = asyncHandler(
    async (req, res) => {
        const { page } = req.params;

        const { data, totalCount } = await supportTicketService.getAll({}, +page);

        res.json(
            new ApiResponse(
                200,
                { tickets: data, totalCount },
                "Support tickets fetched successfully",
            ),
        );
    },
    {
        timestamps: true,
    },
);

const createTicket = asyncHandler(async (req, res) => {
    const payload = req.body;

    const ticket = await supportTicketService.createTicket(payload);

    res.json(
        new ApiResponse(201, ticket, "Support ticket created successfully"),
    );
});

export { getAllTickets, createTicket };
