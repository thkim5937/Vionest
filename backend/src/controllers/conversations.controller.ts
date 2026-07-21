import { Request, Response } from "express";
import { displayNameFromEmail } from "../lib/displayName";
import { prisma } from "../lib/prisma";

async function isParticipant(conversationId: string, userId: string): Promise<boolean> {
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  return conversation !== null && (conversation.searcherId === userId || conversation.posterId === userId);
}

function isConversationUnread(
  conversation: { searcherId: string; posterId: string; searcherLastReadAt: Date | null; posterLastReadAt: Date | null },
  lastMessage: { senderId: string; createdAt: Date } | undefined,
  userId: string,
): boolean {
  if (!lastMessage || lastMessage.senderId === userId) {
    return false;
  }

  const lastReadAt = conversation.searcherId === userId ? conversation.searcherLastReadAt : conversation.posterLastReadAt;

  return lastReadAt === null || lastMessage.createdAt > lastReadAt;
}

export async function createConversation(req: Request, res: Response) {
  const { listingId } = req.body as { listingId?: string };
  const searcherId = req.userId as string;

  if (typeof listingId !== "string" || listingId.trim().length === 0) {
    return res.status(400).json({ error: "listingId is required" });
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const existing = await prisma.conversation.findFirst({
    where: { listingId, searcherId },
  });
  if (existing) {
    return res.status(200).json(existing);
  }

  const conversation = await prisma.conversation.create({
    data: { listingId, searcherId, posterId: listing.posterId },
  });

  return res.status(201).json(conversation);
}

export async function listConversations(req: Request, res: Response) {
  const userId = req.userId as string;

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ searcherId: userId }, { posterId: userId }] },
    include: {
      searcher: true,
      poster: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const results = conversations
    .map((conversation) => {
      const otherParty = conversation.searcherId === userId ? conversation.poster : conversation.searcher;
      const lastMessage = conversation.messages[0];
      const activityAt = lastMessage?.createdAt ?? conversation.createdAt;

      return {
        id: conversation.id,
        listingId: conversation.listingId,
        otherPartyName: displayNameFromEmail(otherParty.email),
        lastMessage: lastMessage
          ? { content: lastMessage.content, createdAt: lastMessage.createdAt, senderId: lastMessage.senderId }
          : null,
        isUnread: isConversationUnread(conversation, lastMessage, userId),
        activityAt,
      };
    })
    .sort((a, b) => b.activityAt.getTime() - a.activityAt.getTime())
    .map(({ activityAt: _activityAt, ...result }) => result);

  return res.status(200).json({ conversations: results });
}

export async function getConversation(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId as string;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { searcher: true, poster: true, listing: true },
  });

  if (!conversation || (conversation.searcherId !== userId && conversation.posterId !== userId)) {
    return res.status(403).json({ error: "Not a participant in this conversation" });
  }

  const otherParty = conversation.searcherId === userId ? conversation.poster : conversation.searcher;

  return res.status(200).json({
    id: conversation.id,
    listingId: conversation.listingId,
    otherPartyName: displayNameFromEmail(otherParty.email),
    listingNeighborhood: conversation.listing.neighborhood,
  });
}

export async function listMessages(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId as string;

  if (!(await isParticipant(id, userId))) {
    return res.status(403).json({ error: "Not a participant in this conversation" });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
  });

  return res.status(200).json({ messages });
}

export async function createMessage(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId as string;
  const { content } = req.body as { content?: string };

  if (!(await isParticipant(id, userId))) {
    return res.status(403).json({ error: "Not a participant in this conversation" });
  }

  if (typeof content !== "string" || content.trim().length === 0) {
    return res.status(400).json({ error: "content is required" });
  }

  const message = await prisma.message.create({
    data: { conversationId: id, senderId: userId, content },
  });

  return res.status(201).json(message);
}

export async function markConversationRead(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId as string;

  const conversation = await prisma.conversation.findUnique({ where: { id } });

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  if (conversation.searcherId !== userId && conversation.posterId !== userId) {
    return res.status(403).json({ error: "Not a participant in this conversation" });
  }

  const isSearcher = conversation.searcherId === userId;

  const updated = await prisma.conversation.update({
    where: { id },
    data: isSearcher ? { searcherLastReadAt: new Date() } : { posterLastReadAt: new Date() },
  });

  return res.status(200).json(updated);
}

export async function getUnreadCount(req: Request, res: Response) {
  const userId = req.userId as string;

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ searcherId: userId }, { posterId: userId }] },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const count = conversations.filter((conversation) =>
    isConversationUnread(conversation, conversation.messages[0], userId),
  ).length;

  return res.status(200).json({ count });
}
