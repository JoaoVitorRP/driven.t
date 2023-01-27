import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentRepository from "@/repositories/payment-repository";
import ticketsService from "../tickets-service";
import { badRequestError, unauthorizedError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";

async function validateTicketOwnership(ticketId: number, userId: number) {
  const ticket = await ticketsService.getTicketById(ticketId);
  const ticketEnrollmentId = ticket.enrollmentId;

  const enrollment = await enrollmentRepository.findEnrollmentIdByUserId(userId);
  const enrollmentId = enrollment.id;

  if (ticketEnrollmentId !== enrollmentId) throw unauthorizedError();

  return ticket;
}

async function getPaymentByTicketId(ticketId: number, userId: number) {
  if (!ticketId) throw badRequestError();

  await validateTicketOwnership(ticketId, userId);

  const payment = await paymentRepository.findPaymentByTicketId(ticketId);

  return payment;
}

async function postPayment(userId: number, ticketId: number, issuer: string, cardNumber: string) {
  const ticket = await validateTicketOwnership(ticketId, userId);
  const ticketTypeId = ticket.ticketTypeId;

  const ticketType = await ticketsService.getTicketTypeById(ticketTypeId);
  const price = ticketType.price;

  const cardLastDigits = cardNumber.slice(-4);
  const payment = await paymentRepository.createPayment(ticketId, price, issuer, cardLastDigits);

  await ticketRepository.updateTicket(ticket.id);

  return payment;
}

const paymentsService = {
  getPaymentByTicketId,
  postPayment,
};

export default paymentsService;
