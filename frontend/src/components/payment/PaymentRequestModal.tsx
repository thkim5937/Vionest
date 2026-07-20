import { useState } from "react";
import { isAxiosError } from "axios";
import PrimaryButton from "../shared/PrimaryButton";
import { sendMessage } from "../../api/conversations";
import { completePaymentRequest, PaymentRequest } from "../../api/payments";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type PaymentMethod = "venmo" | "zelle" | "card";

const PAYMENT_METHODS: { value: PaymentMethod; icon: string; label: string }[] = [
  { value: "venmo", icon: "account_balance_wallet", label: "Venmo" },
  { value: "zelle", icon: "bolt", label: "Zelle" },
  { value: "card", icon: "credit_card", label: "Debit/Credit Card" },
];

interface PaymentRequestModalProps {
  paymentRequest: PaymentRequest;
  conversationId: string;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

export default function PaymentRequestModal({ paymentRequest, conversationId, onClose, onSuccess }: PaymentRequestModalProps) {
  const [step, setStep] = useState<"method" | "confirm">("method");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountLabel = usdFormatter.format(paymentRequest.amount);
  const selectedMethodLabel = PAYMENT_METHODS.find((method) => method.value === selectedMethod)?.label ?? "";

  async function handleConfirmPayment() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await completePaymentRequest(paymentRequest.id);
      await sendMessage(conversationId, `✅ Payment of ${amountLabel} completed`);
      await onSuccess();
      onClose();
    } catch (err) {
      const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
      setError(message ?? "Could not complete payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-inverse-surface/50 flex items-center justify-center z-[60] p-margin-mobile" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-lg w-full max-w-sm p-6 relative flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          className="absolute top-3 right-3 text-on-surface-variant hover:bg-surface-container-low p-1.5 rounded-full transition-colors active:scale-95"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {step === "method" ? (
          <>
            <div className="flex flex-col items-center gap-1 pt-2">
              <p className="font-label-sm text-label-sm text-secondary">Amount</p>
              <p className="font-headline-md text-headline-md text-nyu-violet">{amountLabel}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-label-sm text-label-sm text-secondary">Select Payment Method</p>
              {PAYMENT_METHODS.map(({ value, icon, label }) => {
                const isSelected = selectedMethod === value;
                return (
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected ? "border-2 border-nyu-violet bg-primary-fixed" : "border border-surface-variant hover:bg-surface-container-low"
                    }`}
                    key={value}
                  >
                    <input checked={isSelected} className="sr-only" name="payment_method" onChange={() => setSelectedMethod(value)} type="radio" value={value} />
                    <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 ${isSelected ? "border-nyu-violet" : "border-outline-variant"}`}>
                      <div className={`w-2 h-2 bg-nyu-violet rounded-full transition-transform ${isSelected ? "scale-100" : "scale-0"}`} />
                    </div>
                    <span className={`material-symbols-outlined text-[20px] ${isSelected ? "text-nyu-violet" : "text-on-surface-variant"}`}>{icon}</span>
                    <span className="font-body-md text-body-md text-on-surface">{label}</span>
                  </label>
                );
              })}
            </div>

            <PrimaryButton disabled={!selectedMethod} onClick={() => setStep("confirm")}>
              Continue
            </PrimaryButton>
          </>
        ) : (
          <>
            <h2 className="font-headline-sm text-headline-sm text-on-surface text-center pt-2">Confirm Payment</h2>

            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 border border-surface-variant">
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-secondary">Payment Method</span>
                <span className="font-body-md text-body-md text-on-surface">{selectedMethodLabel}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-surface-variant">
                <span className="font-label-sm text-label-sm text-secondary">Amount</span>
                <span className="font-headline-sm text-headline-sm text-nyu-violet">{amountLabel}</span>
              </div>
            </div>

            {error && <p className="font-label-sm text-label-sm text-error text-center">{error}</p>}

            <PrimaryButton disabled={isSubmitting} onClick={handleConfirmPayment}>
              {isSubmitting ? "Confirming…" : "Confirm Payment"}
            </PrimaryButton>
            <button
              className="text-secondary hover:text-on-surface font-body-md text-body-md py-1 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
              onClick={() => setStep("method")}
              type="button"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
