import { prisma } from "@/config";

function findRoomsById(id: number) {
  return prisma.room.findUnique({
    where: { id },
  });
}

const roomsRepository = {
  findRoomsById,
};

export default roomsRepository;
