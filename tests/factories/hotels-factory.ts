import { prisma } from "@/config";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: "Habbo Hotel",
      image: "https://sm.ign.com/ign_br/screenshot/default/habbo_5byv.jpg",
    },
  });
}
