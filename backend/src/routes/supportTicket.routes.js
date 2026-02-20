import { Router } from "express";
import {
    getAllTickets,
    createTicket,
} from "../controllers/supportTicket.controllers.js";
import { isAuthenticated, authorise } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { addSupportTicketValidations } from "../validations/supportTicket.validations.js";
const router = Router();

router.get("/:page", getAllTickets);

router.post("/", validate(addSupportTicketValidations), createTicket);

export default router;
