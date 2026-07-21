import { FormEvent, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NyuVerifiedBadge from "../components/shared/NyuVerifiedBadge";
import ProfileMenuButton from "../components/shared/ProfileMenuButton";
import PaymentRequestModal from "../components/payment/PaymentRequestModal";
import { useAuth } from "../hooks/useAuth";
import {
  ConversationDetail,
  getConversation,
  getMessages,
  markConversationRead,
  Message,
  sendMessage,
} from "../api/conversations";
import { getListing, ListingDetail } from "../api/listings";
import { createPaymentRequest, getPaymentRequests, PaymentRequest } from "../api/payments";

const POLL_INTERVAL_MS = 4000;

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type TimelineItem =
  | { type: "message"; createdAt: string; message: Message }
  | { type: "payment"; createdAt: string; paymentRequest: PaymentRequest };

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [payingRequest, setPayingRequest] = useState<PaymentRequest | null>(null);

  const isPoster = listing !== null && user !== null && listing.posterId === user.userId;

  useEffect(() => {
    if (!conversationId) return;

    setIsLoading(true);
    setError(null);

    getConversation(conversationId)
      .then(async (conversationDetail) => {
        setConversation(conversationDetail);
        markConversationRead(conversationId).catch(() => {});
        const [messageList, paymentRequestList, listingDetail] = await Promise.all([
          getMessages(conversationId),
          getPaymentRequests(conversationId),
          getListing(conversationDetail.listingId),
        ]);
        setMessages(messageList);
        setPaymentRequests(paymentRequestList);
        setListing(listingDetail);
      })
      .catch((err) => {
        const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
        setError(message ?? "Could not load this conversation. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [conversationId]);

  async function refetchMessagesAndPayments() {
    if (!conversationId) return;

    const [messageList, paymentRequestList] = await Promise.all([
      getMessages(conversationId),
      getPaymentRequests(conversationId),
    ]);
    setMessages(messageList);
    setPaymentRequests(paymentRequestList);
  }

  useEffect(() => {
    if (!conversationId) return;

    const intervalId = setInterval(() => {
      refetchMessagesAndPayments().catch(() => {});
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [conversationId]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!conversationId || !draft.trim() || isSending) return;

    setIsSending(true);
    setSendError(null);

    try {
      const message = await sendMessage(conversationId, draft.trim());
      setMessages((prev) => [...prev, message]);
      setDraft("");
    } catch (err) {
      const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
      setSendError(message ?? "Could not send your message. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  function openPaymentForm() {
    setPaymentError(null);
    setPaymentAmount(listing ? String(listing.price) : "");
    setShowPaymentForm(true);
  }

  async function handleRequestPayment(e: FormEvent) {
    e.preventDefault();
    if (!conversationId || isSubmittingPayment) return;

    const amount = Number(paymentAmount);
    if (!Number.isInteger(amount) || amount <= 0) {
      setPaymentError("Enter a valid whole-dollar amount");
      return;
    }

    setIsSubmittingPayment(true);
    setPaymentError(null);

    try {
      const created = await createPaymentRequest(conversationId, amount);
      setPaymentRequests((prev) => [...prev, created]);
      setShowPaymentForm(false);
      setPaymentAmount("");
    } catch (err) {
      const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
      setPaymentError(message ?? "Could not create payment request. Please try again.");
    } finally {
      setIsSubmittingPayment(false);
    }
  }

  const timeline: TimelineItem[] = [
    ...messages.map((message) => ({ type: "message" as const, createdAt: message.createdAt, message })),
    ...paymentRequests.map((paymentRequest) => ({
      type: "payment" as const,
      createdAt: paymentRequest.createdAt,
      paymentRequest,
    })),
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="bg-background text-on-background h-screen flex flex-col font-body-md text-body-md overflow-hidden">
      {/* Top App Bar (Chat specific) */}
      <header className="bg-surface border-b border-surface-variant flex items-center justify-between px-margin-mobile py-4 w-full sticky top-0 z-50">
        <button
          className="text-on-surface hover:bg-surface-container-low p-2 rounded-full transition-colors active:scale-95 duration-150"
          onClick={() => navigate("/inbox")}
          type="button"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            {conversation?.otherPartyName ?? ""}
            {conversation && <NyuVerifiedBadge />}
          </h1>
          <p className="text-secondary font-label-sm text-label-sm">{conversation?.listingNeighborhood ?? ""}</p>
        </div>
        <ProfileMenuButton />
      </header>

      {/* Chat Canvas */}
      <main className="flex-1 overflow-y-auto px-margin-mobile py-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-nyu-violet animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 text-center py-16">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">error_outline</span>
            <p className="font-body-md text-body-md text-on-surface-variant">{error}</p>
          </div>
        ) : (
          timeline.map((item) => {
            if (item.type === "message") {
              const message = item.message;
              const isOwnMessage = message.senderId === user?.userId;
              return (
                <div className={`flex mb-2 ${isOwnMessage ? "justify-end" : "justify-start"}`} key={`message-${message.id}`}>
                  <div
                    className={
                      isOwnMessage
                        ? "bg-nyu-violet text-on-primary max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-2 shadow-sm"
                        : "bg-surface-container text-on-surface max-w-[75%] rounded-2xl rounded-tl-sm px-4 py-2 border border-surface-variant shadow-sm"
                    }
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              );
            }

            const paymentRequest = item.paymentRequest;
            const isCompleted = paymentRequest.status === "COMPLETED";
            const canMakePayment = !isPoster && !isCompleted;

            return (
              <div className="flex justify-center my-2" key={`payment-${paymentRequest.id}`}>
                <div className="bg-surface-container-lowest border border-nyu-violet/40 rounded-2xl px-5 py-4 flex flex-col items-center gap-2 shadow-sm min-w-[220px]">
                  <span className="material-symbols-outlined text-nyu-violet text-[28px]">
                    {isCompleted ? "check_circle" : "payments"}
                  </span>
                  <p className="font-headline-sm text-headline-sm text-on-surface">
                    {usdFormatter.format(paymentRequest.amount)}
                  </p>
                  <p className="font-label-sm text-label-sm text-secondary">{isCompleted ? "Paid" : "Payment Requested"}</p>
                  {canMakePayment && (
                    <button
                      className="bg-nyu-violet text-on-primary px-4 py-1.5 rounded-full font-label-sm text-label-sm mt-1 hover:opacity-90 transition-colors active:scale-95 duration-150"
                      onClick={() => setPayingRequest(paymentRequest)}
                      type="button"
                    >
                      Make Payment
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Request Payment (poster-only affordance) */}
        {isPoster && (
          <div className="flex flex-col items-center gap-2 my-4">
            {showPaymentForm ? (
              <form className="flex flex-col items-center gap-2 bg-surface-container-lowest border border-nyu-violet/40 rounded-2xl px-5 py-4 shadow-sm" onSubmit={handleRequestPayment}>
                <label className="font-label-sm text-label-sm text-secondary" htmlFor="payment-amount">
                  Amount (USD)
                </label>
                <input
                  className="bg-surface-container-low border border-surface-variant rounded-full px-4 py-2 text-center font-body-md text-body-md text-on-surface w-40 focus:outline-none focus:border-nyu-violet"
                  id="payment-amount"
                  min={1}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  step={1}
                  type="number"
                  value={paymentAmount}
                />
                {paymentError && <p className="font-label-sm text-label-sm text-error">{paymentError}</p>}
                <div className="flex items-center gap-2">
                  <button
                    className="text-secondary hover:text-on-surface px-4 py-2 rounded-full font-label-sm text-label-sm transition-colors active:scale-95 duration-150"
                    onClick={() => setShowPaymentForm(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-nyu-violet text-on-primary px-4 py-2 rounded-full font-label-sm text-label-sm hover:opacity-90 transition-colors active:scale-95 duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmittingPayment}
                    type="submit"
                  >
                    {isSubmittingPayment ? "Sending…" : "Send Request"}
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="bg-surface-container-lowest border border-nyu-violet text-nyu-violet hover:bg-primary-fixed-dim px-6 py-2 rounded-full font-label-sm text-label-sm flex items-center gap-2 transition-colors active:scale-95 duration-150 shadow-sm"
                onClick={openPaymentForm}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">payments</span>
                Request Payment
              </button>
            )}
          </div>
        )}
      </main>

      {/* Bottom Input Area */}
      <footer className="bg-surface border-t border-surface-variant p-margin-mobile flex flex-col gap-1">
        {sendError && <p className="font-label-sm text-label-sm text-error px-2">{sendError}</p>}
        <form className="flex items-center gap-3" onSubmit={handleSend}>
          <button className="text-secondary hover:text-primary transition-colors p-2 rounded-full active:scale-95" type="button">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <div className="flex-1 bg-surface-container-low rounded-full flex items-center px-4 py-2 border border-surface-variant focus-within:border-nyu-violet focus-within:ring-1 focus-within:ring-nyu-violet transition-all">
            <input
              className="bg-transparent border-none focus:ring-0 w-full font-body-md text-body-md text-on-surface placeholder:text-secondary p-0"
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message..."
              type="text"
              value={draft}
            />
          </div>
          <button
            className="bg-nyu-violet text-on-primary p-3 rounded-full hover:opacity-90 transition-colors active:scale-90 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!draft.trim() || isSending}
            type="submit"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </footer>

      {payingRequest && conversationId && (
        <PaymentRequestModal
          conversationId={conversationId}
          onClose={() => setPayingRequest(null)}
          onSuccess={refetchMessagesAndPayments}
          paymentRequest={payingRequest}
        />
      )}
    </div>
  );
}
