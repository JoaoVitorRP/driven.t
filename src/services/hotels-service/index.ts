import { badRequestError, notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketsService from "../tickets-service";

async function validateEnrollmentAndTicket(userId: number) {
  const ticket = await ticketsService.getTickets(userId);

  if (ticket.status !== "PAID") {
    throw {
      name: "PaymentRequiredError",
      message: "Your ticket must be paid before you continue",
    };
  }

  const ticketType = await ticketsService.getTicketTypeById(ticket.ticketTypeId);

  if (!ticketType.includesHotel || ticketType.isRemote) {
    throw {
      name: "PaymentRequiredError",
      message: "Your ticket is remote or doesn't include a hotel",
    };
  }
}

async function getHotels(userId: number) {
  await validateEnrollmentAndTicket(userId);

  return hotelsRepository.findHotels();
}

async function getHotelRooms(userId: number, hotelId: number) {
  if (!hotelId) throw badRequestError();

  await validateEnrollmentAndTicket(userId);

  const hotel = await hotelsRepository.findHotelRooms(hotelId);

  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelsService = {
  getHotels,
  getHotelRooms,
};

export default hotelsService;
