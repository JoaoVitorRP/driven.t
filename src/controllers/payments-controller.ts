import { AuthenticatedRequest } from "@/middlewares";
import { postPaymentBody } from "@/protocols";
import paymentsService from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query;
  const { userId } = req;

  try {
    const payment = await paymentsService.getPaymentByTicketId(Number(ticketId), userId);

    return res.status(httpStatus.OK).send(payment);
  } catch (err) {
    if (err.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    if (err.name === "UnauthorizedError") return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (err.name === "BadRequestError") return res.sendStatus(httpStatus.BAD_REQUEST);
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId, cardData } = req.body as postPaymentBody;
  const { issuer, number } = cardData;
  const { userId } = req;

  try {
    const payment = await paymentsService.postPayment(userId, ticketId, issuer, number);

    return res.status(httpStatus.OK).send(payment);
  } catch (err) {
    if (err.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    if (err.name === "UnauthorizedError") return res.sendStatus(httpStatus.UNAUTHORIZED);
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
