import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import {
  createValidBooking,
  createEnrollmentWithAddress,
  createHotel,
  createTicket,
  createTicketTypeWithDefinedStatus,
  createUser,
  createFullRoom,
  createRoom,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/config";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("Should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with status 404 when user does not have an enrollment yet", async () => {
      const token = await generateValidToken();

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 404 when user does not have a booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 200 and with booking data", async () => {
      const { token, roomData, bookingData } = await createValidBooking();

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: bookingData.id,
        Room: {
          id: roomData.id,
          name: roomData.name,
          capacity: roomData.capacity,
          hotelId: roomData.hotelId,
          createdAt: roomData.createdAt.toISOString(),
          updatedAt: roomData.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe("POST /booking", () => {
  it("Should respond with status 401 if no token is given", async () => {
    const response = await server.post("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("Should respond with status 404 when user does not have an enrollment yet", async () => {
      const token = await generateValidToken();

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: faker.datatype.number(),
      });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 404 when given room does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollmentData = await createEnrollmentWithAddress(user);
      const ticketTypeData = await createTicketTypeWithDefinedStatus(false, true);
      await createTicket(enrollmentData.id, ticketTypeData.id, "PAID");

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: 0,
      });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 404 when user does not have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: faker.datatype.number(),
      });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 403 if ticket is not paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithDefinedStatus(false, true);
      await createTicket(enrollment.id, ticketType.id, "RESERVED");

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: faker.datatype.number(),
      });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 403 if ticketType is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithDefinedStatus(true, false);
      await createTicket(enrollment.id, ticketType.id, "PAID");

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: faker.datatype.number(),
      });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 403 if ticketType does not include a hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithDefinedStatus(false, false);
      await createTicket(enrollment.id, ticketType.id, "PAID");

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: faker.datatype.number(),
      });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 403 if user already has a booking", async () => {
      const { token } = await createValidBooking();

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: faker.datatype.number(),
      });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 403 if given room is already full", async () => {
      const { token, roomData } = await createFullRoom();

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: roomData.id,
      });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status 200 and with booking id and insert new booking in the database", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollmentData = await createEnrollmentWithAddress(user);
      const ticketTypeData = await createTicketTypeWithDefinedStatus(false, true);
      await createTicket(enrollmentData.id, ticketTypeData.id, "PAID");
      const hotelData = await createHotel();
      const roomData = await createRoom(hotelData.id);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: roomData.id,
      });

      const entityCount = await prisma.booking.count();

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
      expect(entityCount).toBe(1);
    });
  });
});
