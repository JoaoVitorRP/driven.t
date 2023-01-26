import { getTickets, getTicketTypes, postTicket } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { ticketSchema } from "@/schemas/ticket-schema";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .post("/", validateBody(ticketSchema), postTicket)
  .get("/", getTickets)
  .get("/types", getTicketTypes);

export { ticketsRouter };
