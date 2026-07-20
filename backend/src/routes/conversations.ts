import { Router } from "express";
import {
  createConversation,
  createMessage,
  getConversation,
  listConversations,
  listMessages,
} from "../controllers/conversations.controller";
import { createPaymentRequest, listPaymentRequests } from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, createConversation);
router.get("/", requireAuth, listConversations);
router.get("/:id", requireAuth, getConversation);
router.get("/:id/messages", requireAuth, listMessages);
router.post("/:id/messages", requireAuth, createMessage);
router.post("/:conversationId/payment-requests", requireAuth, createPaymentRequest);
router.get("/:conversationId/payment-requests", requireAuth, listPaymentRequests);

export default router;
