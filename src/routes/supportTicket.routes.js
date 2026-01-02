const { Router } = require("express");
const {
    getAllTickets,
    createTicket,
} = require("../controllers/supportTicket.controllers");
const { isAuthenticated, authorise } = require("../middlewares/auth.middlewares");
const {validate} = require("../middlewares/validate.middlewares");
const { addSupportTicketValidations } = require("../validations/supportTicket.validations");
const router = Router();

router.get("/", isAuthenticated, authorise("super-admin"), getAllTickets);

router.post("/", validate(addSupportTicketValidations), createTicket);

module.exports = router;
