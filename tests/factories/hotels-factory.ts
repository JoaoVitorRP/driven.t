import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: "Habbo Hotel",
      image: "https://sm.ign.com/ign_br/screenshot/default/habbo_5byv.jpg",
    },
  });
}
