import { prisma } from "@/config";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
}

async function createPayment(ticketId: number, price: number, issuer: string, cardLastDigits: string) {
  return prisma.payment.create({
    data: {
      ticketId: ticketId,
      value: price,
      cardIssuer: issuer,
      cardLastDigits: cardLastDigits,
    },
  });
}

const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
};

export default paymentRepository;
