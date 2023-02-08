import { prisma } from "@/config";
import { generateValidToken } from "../helpers";
import { createEnrollmentWithAddress } from "./enrollments-factory";
import { createHotel } from "./hotels-factory";
import { createRoom } from "./rooms-factory";
import { createTicket, createTicketTypeWithDefinedStatus } from "./tickets-factory";
import { createUser } from "./users-factory";

export async function createValidBooking() {
  const user = await createUser();
  const token = await generateValidToken(user);
  const enrollmentData = await createEnrollmentWithAddress(user);
  const ticketTypeData = await createTicketTypeWithDefinedStatus(false, true);
  await createTicket(enrollmentData.id, ticketTypeData.id, "PAID");
  const hotelData = await createHotel();
  const roomData = await createRoom(hotelData.id);

  const bookingData = await prisma.booking.create({
    data: {
      userId: user.id,
      roomId: roomData.id,
    },
  });

  return { token, roomData, bookingData };
}
