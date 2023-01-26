import { notFoundError } from "@/errors";
import { TicketType } from "@/protocols";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentsService from "../enrollments-service";

async function getTicketTypes(): Promise<TicketType[]> {
  const types = await ticketRepository.findTicketTypes();

  return types;
}

async function getTickets(userId: number) {
  const enrollmentId = await enrollmentsService.getEnrollmentIdFromUserId(userId);

  const tickets = await ticketRepository.findTickets(enrollmentId);

  if (!tickets) throw notFoundError();

  return tickets;
}

async function postTicket(userId: number, ticketTypeId: number) {
  const enrollmentId = await enrollmentsService.getEnrollmentIdFromUserId(userId);

  await ticketRepository.createTicket(enrollmentId, ticketTypeId);

  const tickets = await ticketRepository.findTickets(enrollmentId);

  return tickets;
}

const ticketsService = {
  getTicketTypes,
  getTickets,
  postTicket,
};

export default ticketsService;
