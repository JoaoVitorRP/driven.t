import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import roomsRepository from "@/repositories/rooms-repository";
import ticketsService from "../tickets-service";

async function validateEnrollmentAndTicket(userId: number) {
  const ticket = await ticketsService.getTickets(userId);

  if (ticket.status !== "PAID") {
    throw {
      name: "ForbiddenError",
      message: "Your ticket must be paid before you continue",
    };
  }

  const ticketType = await ticketsService.getTicketTypeById(ticket.ticketTypeId);

  if (!ticketType.includesHotel || ticketType.isRemote) {
    throw {
      name: "ForbiddenError",
      message: "Your ticket is remote or doesn't include a hotel",
    };
  }
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  await validateEnrollmentAndTicket(userId);

  const booking = await bookingRepository.findBooking(userId);
  if (booking) {
    throw {
      name: "ForbiddenError",
      message: "User already has a booking",
    };
  }

  const room = await roomsRepository.findRoomsById(roomId);
  if (!room) throw notFoundError();

  const bookingCount = await bookingRepository.countBookings(roomId);
  if (bookingCount._count.roomId >= room.capacity) {
    throw {
      name: "ForbiddenError",
      message: "This room is already full",
    };
  }

  const bookingData = { userId: userId, roomId: roomId };
  const { id } = await bookingRepository.createBooking(bookingData);

  return id;
}

async function putBooking(userId: number, bookingId: number, roomId: number) {
  if (!bookingId) {
    throw {
      name: "ForbiddenError",
      message: "Booking id must be a number",
    };
  }

  const booking = await bookingRepository.findBookingById(bookingId);
  if (!booking || booking.userId !== userId) {
    throw {
      name: "ForbiddenError",
      message: "Invalid booking id",
    };
  }

  const room = await roomsRepository.findRoomsById(roomId);
  if (!room) throw notFoundError();

  const bookingCount = await bookingRepository.countBookings(roomId);
  if (bookingCount._count.roomId >= room.capacity) {
    throw {
      name: "ForbiddenError",
      message: "This room is already full",
    };
  }

  const { id } = await bookingRepository.updateBooking(bookingId, roomId);

  return id;
}

const bookingService = {
  getBooking,
  postBooking,
  putBooking,
};

export default bookingService;
