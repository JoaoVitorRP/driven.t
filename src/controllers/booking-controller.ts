import { AuthenticatedRequest } from "@/middlewares";
import { postBookingRequest } from "@/protocols";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (err) {
    if (err.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(err.message);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as postBookingRequest;

  try {
    const bookingId = await bookingService.postBooking(userId, Number(roomId));

    return res.status(httpStatus.OK).send({ bookingId });
  } catch (err) {
    if (err.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(err.message);
    if (err.name === "ForbiddenError") return res.status(httpStatus.FORBIDDEN).send(err.message);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { bookingId } = req.params;
  const { roomId } = req.body as postBookingRequest;

  try {
    const id = await bookingService.putBooking(userId, Number(bookingId), Number(roomId));

    return res.status(httpStatus.OK).send({ bookingId: id });
  } catch (err) {
    if (err.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(err.message);
    if (err.name === "ForbiddenError") return res.status(httpStatus.FORBIDDEN).send(err.message);
  }
}
