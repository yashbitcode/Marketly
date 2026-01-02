const supportTicketService = require("../services/supportTicket.service");
const ApiResponse = require("../utils/api-response");
const { asyncHandler } = require("../utils/asyncHandler");

const getAllTickets = asyncHandler(
    async (req, res) => {
        const { page } = req.params;

        const allTickets = await supportTicketService.getAll({}, +page);

        res.json(
            new ApiResponse(
                200,
                allTickets,
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

module.exports = {
    getAllTickets,
    createTicket,
};
