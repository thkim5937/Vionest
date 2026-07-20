import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function createPaymentRequest(req: Request, res: Response) {
  const { conversationId } = req.params;
  const userId = req.userId as string;
  const { amount } = req.body as { amount?: number };

  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  if (conversation.posterId !== userId) {
    return res.status(403).json({ error: "Only the poster may create a payment request" });
  }

  if (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) {
    return res.status(400).json({ error: "amount must be a positive integer" });
  }

  const paymentRequest = await prisma.paymentRequest.create({
    data: { conversationId, amount, status: "PENDING" },
  });

  return res.status(201).json(paymentRequest);
}

export async function listPaymentRequests(req: Request, res: Response) {
  const { conversationId } = req.params;
  const userId = req.userId as string;

  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation || (conversation.searcherId !== userId && conversation.posterId !== userId)) {
    return res.status(403).json({ error: "Not a participant in this conversation" });
  }

  const paymentRequests = await prisma.paymentRequest.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  return res.status(200).json({ paymentRequests });
}

export async function completePaymentRequest(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId as string;

  const paymentRequest = await prisma.paymentRequest.findUnique({
    where: { id },
    include: { conversation: true },
  });

  if (!paymentRequest) {
    return res.status(404).json({ error: "Payment request not found" });
  }

  if (paymentRequest.conversation.searcherId !== userId) {
    return res.status(403).json({ error: "Only the searcher may complete a payment request" });
  }

  if (paymentRequest.status === "COMPLETED") {
    return res.status(400).json({ error: "Payment request is already completed" });
  }

  const updated = await prisma.paymentRequest.update({
    where: { id },
    data: { status: "COMPLETED" },
  });

  return res.status(200).json(updated);
}
