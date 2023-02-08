import { prisma } from "@/config";
import { postBookingBody } from "@/protocols";

function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: true,
    },
  });
}

function createBooking(bookingData: postBookingBody) {
  return prisma.booking.create({
    data: bookingData,
  });
}

function countBookings(roomId: number) {
  return prisma.booking.aggregate({
    _count: {
      roomId: true,
    },
    where: { roomId },
  });
}

function findBookingById(id: number) {
  return prisma.booking.findUnique({
    where: { id },
  });
}

function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId: roomId,
    },
  });
}

const bookingRepository = {
  findBooking,
  createBooking,
  countBookings,
  findBookingById,
  updateBooking,
};

export default bookingRepository;
