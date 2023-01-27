import { getPayments, postPayment } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { paymentSchema } from "@/schemas/payment-schema";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPayments)
  .post("/process", validateBody(paymentSchema), postPayment);

export { paymentsRouter };
