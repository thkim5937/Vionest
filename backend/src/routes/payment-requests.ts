import { Router } from "express";
import { completePaymentRequest } from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/:id/complete", requireAuth, completePaymentRequest);

export default router;
