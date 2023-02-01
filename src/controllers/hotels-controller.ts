import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotels(userId);

    return res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    if (err.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(err.message);
    if (err.name === "UnauthorizedError") return res.status(httpStatus.UNAUTHORIZED).send(err.message);
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;

  try {
    const hotelRooms = await hotelsService.getHotelRooms(Number(hotelId));

    return res.status(httpStatus.OK).send(hotelRooms);
  } catch (err) {
    if (err.name === "BadRequestError") return res.status(httpStatus.BAD_REQUEST).send(err.message);
    if (err.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(err.message);
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
