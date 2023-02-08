import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { generateValidToken } from "../helpers";
import { createEnrollmentWithAddress } from "./enrollments-factory";
import { createHotel } from "./hotels-factory";
import { createTicket, createTicketTypeWithDefinedStatus } from "./tickets-factory";
import { createUser } from "./users-factory";

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: "A1",
      capacity: faker.datatype.number({ min: 1, max: 4 }),
      hotelId: hotelId,
    },
  });
}

export async function createFullRoom() {
  const user = await createUser();
  const token = await generateValidToken(user);
  const enrollmentData = await createEnrollmentWithAddress(user);
  const ticketTypeData = await createTicketTypeWithDefinedStatus(false, true);
  await createTicket(enrollmentData.id, ticketTypeData.id, "PAID");
  const hotelData = await createHotel();

  const roomData = await prisma.room.create({
    data: {
      name: faker.random.locale(),
      capacity: 0,
      hotelId: hotelData.id,
    },
  });

  return { token, roomData };
}
