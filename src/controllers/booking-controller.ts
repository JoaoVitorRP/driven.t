import { AuthenticatedRequest } from "@/middlewares";
import { postBookingRequest } from "@/protocols";
import bookingService from "@/services/booking-service";
import { Response } from "express";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(userId);

    return res.status(200).send(booking);
  } catch (err) {
    if (err.name === "NotFoundError") return res.status(404).send(err.message);
    return res.status(203).send(err.message);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as postBookingRequest;

  try {
    const bookingId = await bookingService.postBooking(userId, Number(roomId));

    return res.status(200).send({ bookingId });
  } catch (err) {
    if (err.name === "NotFoundError") return res.status(404).send(err.message);
    if (err.name === "ForbiddenError") return res.status(403).send(err.message);
    return res.status(203).send(err.message);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { bookingId } = req.params;
  const { roomId } = req.body as postBookingRequest;

  try {
    const id = await bookingService.putBooking(userId, Number(bookingId), Number(roomId));

    return res.status(200).send({ bookingId: id });
  } catch (err) {
    if (err.name === "NotFoundError") return res.status(404).send(err.message);
    if (err.name === "ForbiddenError") return res.status(403).send(err.message);
    return res.status(203).send(err.message);
  }
}
