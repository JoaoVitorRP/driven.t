import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: "A1",
      capacity: faker.datatype.number({ min: 1, max: 4 }),
      hotelId: hotelId,
    },
  });
}

export async function createFullRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.random.locale(),
      capacity: 0,
      hotelId: hotelId,
    },
  });
}
