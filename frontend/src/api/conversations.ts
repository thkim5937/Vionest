import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export interface Conversation {
  id: string;
  listingId: string;
  searcherId: string;
  posterId: string;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  listingId: string;
  otherPartyName: string;
  lastMessage: { content: string; createdAt: string; senderId: string } | null;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface ConversationDetail {
  id: string;
  listingId: string;
  otherPartyName: string;
  listingNeighborhood: string;
}

export async function createOrFindConversation(listingId: string): Promise<Conversation> {
  const { data } = await client.post<Conversation>("/api/conversations", { listingId });
  return data;
}

export async function getConversations(): Promise<ConversationSummary[]> {
  const { data } = await client.get<{ conversations: ConversationSummary[] }>("/api/conversations");
  return data.conversations;
}

export async function getConversation(conversationId: string): Promise<ConversationDetail> {
  const { data } = await client.get<ConversationDetail>(`/api/conversations/${conversationId}`);
  return data;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data } = await client.get<{ messages: Message[] }>(`/api/conversations/${conversationId}/messages`);
  return data.messages;
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  const { data } = await client.post<Message>(`/api/conversations/${conversationId}/messages`, { content });
  return data;
}
