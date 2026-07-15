import { useState } from "react";

type PaymentMethod = "card" | "bank" | "venmo" | "zelle";

const PAYMENT_METHODS: { value: PaymentMethod; icon: string; label: string }[] = [
  { value: "card", icon: "credit_card", label: "Credit / Debit Card" },
  { value: "bank", icon: "account_balance", label: "Bank Transfer (ACH)" },
  { value: "venmo", icon: "payments", label: "Venmo" },
  { value: "zelle", icon: "currency_exchange", label: "Zelle" },
];

export default function PaymentMethodScreen() {
  // Local UI-only selection state (mock flow — no real payment API, per PRD 4.2).
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky flex items-center justify-between px-margin-mobile h-16 bg-surface border-b border-outline-variant z-40">
        <button aria-label="Go back" className="text-on-surface-variant hover:bg-surface-container-low transition-colors active:opacity-70 p-2 rounded-full flex items-center justify-center" type="button">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-primary truncate flex-1 text-center">Payment</h1>
        <button aria-label="Help" className="text-on-surface-variant hover:bg-surface-container-low transition-colors active:opacity-70 p-2 rounded-full flex items-center justify-center" type="button">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-margin-mobile py-stack-lg max-w-2xl mx-auto w-full flex flex-col gap-stack-lg pb-32">
        {/* Summary Card */}
        <section className="bg-surface-container-low rounded-xl p-stack-md border border-outline-variant shadow-sm flex flex-col gap-stack-sm">
          <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Payment Summary</h2>
          <div className="flex justify-between items-start gap-4">
            <div>
              {/* TODO: bind to listing name/address */}
              <p className="font-headline-sm text-headline-sm text-on-background">123 Bleecker St, Unit 4B</p>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Monthly Rent</p>
            </div>
            <div className="text-right">
              {/* TODO: bind to PaymentRequest.amount (defaults to listing price, editable by poster) */}
              <p className="font-display-price text-display-price text-nyu-violet">$2,400</p>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">/ month</p>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="flex flex-col gap-stack-md">
          <h3 className="font-headline-sm text-headline-sm text-on-background mb-2">Select Payment Method</h3>
          <form className="flex flex-col gap-3">
            {PAYMENT_METHODS.map(({ value, icon, label }) => {
              const isSelected = selectedMethod === value;
              return (
                <label
                  className={`relative flex items-center p-4 cursor-pointer rounded-xl transition-all ${
                    isSelected ? "border-2 border-nyu-violet bg-surface-container-lowest" : "border border-outline-variant bg-surface hover:bg-surface-container-lowest"
                  }`}
                  key={value}
                >
                  <input
                    checked={isSelected}
                    className="peer sr-only"
                    name="payment_method"
                    onChange={() => setSelectedMethod(value)}
                    type="radio"
                    value={value}
                  />
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mr-4 ${isSelected ? "border-nyu-violet" : "border-outline-variant"}`}>
                    <div className={`w-2.5 h-2.5 bg-nyu-violet rounded-full transition-transform ${isSelected ? "scale-100" : "scale-0"}`} />
                  </div>
                  <div className={`flex items-center gap-3 flex-1 ${isSelected ? "opacity-100" : "opacity-80"}`}>
                    <span className={`material-symbols-outlined ${isSelected ? "text-nyu-violet" : "text-on-surface-variant"}`}>{icon}</span>
                    <span className={`font-body-lg text-body-lg text-on-background ${isSelected ? "font-medium" : ""}`}>{label}</span>
                  </div>
                </label>
              );
            })}
          </form>
        </section>
      </main>

      {/* Bottom Actions (Sticky) */}
      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-sm border-t border-outline-variant p-margin-mobile pb-safe flex flex-col gap-4 z-40">
        <div className="max-w-2xl mx-auto w-full flex flex-col items-center">
          {/* TODO: wire onClick -> navigate to PaymentConfirmScreen with selectedMethod */}
          <button className="w-full bg-nyu-violet text-on-primary py-3 px-6 rounded-full font-headline-sm text-headline-sm hover:opacity-90 transition-colors shadow-sm active:scale-[0.98]" type="button">
            Continue
          </button>
          <button className="mt-4 font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors underline-offset-4 hover:underline" type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
