import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentsService from "../enrollments-service";

async function getTicketTypes() {
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

async function getTicketById(ticketId: number) {
  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) throw notFoundError();

  return ticket;
}

async function getTicketTypeById(ticketTypeId: number) {
  const ticketType = await ticketRepository.findTicketTypeById(ticketTypeId);

  if (!ticketType) throw notFoundError();

  return ticketType;
}

const ticketsService = {
  getTicketTypes,
  getTickets,
  postTicket,
  getTicketById,
  getTicketTypeById,
};

export default ticketsService;
