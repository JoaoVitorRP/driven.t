import { prisma } from "@/config";

async function findTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findTickets(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function createTicket(enrollmentId: number, ticketTypeId: number) {
  return prisma.ticket.create({
    data: {
      enrollmentId: enrollmentId,
      ticketTypeId: ticketTypeId,
      status: "RESERVED",
    },
  });
}

async function findTicketById(ticketId: number) {
  return prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });
}

async function findTicketTypeById(ticketTypeId: number) {
  return prisma.ticketType.findUnique({
    where: {
      id: ticketTypeId,
    },
  });
}

async function updateTicket(id: number) {
  return prisma.ticket.update({
    where: {
      id: id,
    },
    data: {
      status: "PAID",
    },
  });
}

const ticketRepository = {
  findTicketTypes,
  findTickets,
  createTicket,
  findTicketById,
  findTicketTypeById,
  updateTicket,
};

export default ticketRepository;
