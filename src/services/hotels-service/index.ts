import { badRequestError, notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketsService from "../tickets-service";

async function getHotels(userId: number) {
  const ticket = await ticketsService.getTickets(userId);

  if (ticket.status !== "PAID") {
    throw {
      name: "UnauthorizedError",
      message: "Your ticket must be paid before you continue",
    };
  }

  const ticketType = await ticketsService.getTicketTypeById(ticket.ticketTypeId);

  if (!ticketType.includesHotel) {
    throw {
      name: "UnauthorizedError",
      message: "Your ticket doesn't include a hotel",
    };
  }

  return hotelsRepository.findHotels();
}

async function getHotelRooms(hotelId: number) {
  if (!hotelId) throw badRequestError();

  const hotel = await hotelsRepository.findHotelRooms(hotelId);

  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelsService = {
  getHotels,
  getHotelRooms,
};

export default hotelsService;
