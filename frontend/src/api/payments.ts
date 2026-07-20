import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export interface PaymentRequest {
  id: string;
  conversationId: string;
  amount: number;
  status: "PENDING" | "COMPLETED";
  createdAt: string;
}

export async function createPaymentRequest(conversationId: string, amount: number): Promise<PaymentRequest> {
  const { data } = await client.post<PaymentRequest>(`/api/conversations/${conversationId}/payment-requests`, {
    amount,
  });
  return data;
}

export async function getPaymentRequests(conversationId: string): Promise<PaymentRequest[]> {
  const { data } = await client.get<{ paymentRequests: PaymentRequest[] }>(
    `/api/conversations/${conversationId}/payment-requests`,
  );
  return data.paymentRequests;
}

export async function completePaymentRequest(id: string): Promise<PaymentRequest> {
  const { data } = await client.post<PaymentRequest>(`/api/payment-requests/${id}/complete`);
  return data;
}
