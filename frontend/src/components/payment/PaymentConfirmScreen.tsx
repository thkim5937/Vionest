export default function PaymentConfirmScreen() {
  return (
    <div className="bg-background text-on-background font-body-md h-screen flex flex-col items-center">
      <div className="w-full max-w-md h-full flex flex-col relative bg-surface md:shadow-lg md:my-8 md:h-[800px] md:rounded-xl overflow-hidden">
        {/* TopAppBar */}
        <header className="flex items-center justify-between px-margin-mobile h-16 w-full top-0 sticky bg-surface border-b border-outline-variant z-10">
          <button className="text-primary hover:bg-surface-container-low transition-colors rounded-full p-2 -ml-2 active:opacity-70 flex items-center justify-center" type="button">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary flex-1 text-center pr-8">Payment</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Main Content (Canvas) */}
        <main className="flex-1 overflow-y-auto px-margin-mobile py-stack-md flex flex-col gap-stack-lg">
          <div className="flex flex-col gap-stack-sm text-center pt-4">
            <h2 className="font-display-price text-display-price text-on-background">Confirm Payment</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Please review your transaction details below.</p>
          </div>

          {/* Summary Card */}
          <div className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-4 border border-outline-variant">
            <div className="flex flex-col gap-1 pb-4 border-b border-outline-variant">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Listing</span>
              {/* TODO: bind to listing name/address */}
              <span className="font-headline-sm text-headline-sm text-on-background">123 Bleecker St, Unit 4B</span>
            </div>
            <div className="flex flex-col gap-1 pb-4 border-b border-outline-variant">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Payment Method</span>
              {/* TODO: bind to the method selected on PaymentMethodScreen */}
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
                <span className="font-body-lg text-body-lg text-on-background">Credit / Debit Card</span>
              </div>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Amount</span>
              {/* TODO: bind to PaymentRequest.amount */}
              <span className="font-display-price text-display-price text-primary">$2,400</span>
            </div>
          </div>

          {/* Trust Badge area */}
          <div className="flex items-center justify-center gap-2 mt-4 text-on-surface-variant opacity-80">
            <span className="material-symbols-outlined [font-variation-settings:'FILL'_1]">lock</span>
            <span className="font-label-sm text-label-sm">Secure Payment Processing</span>
          </div>
        </main>

        {/* Fixed Bottom Action Area */}
        <div className="px-margin-mobile py-4 bg-surface border-t border-outline-variant pb-safe pb-8 flex flex-col gap-4 sticky bottom-0 w-full z-20">
          {/* TODO: wire onClick -> POST /conversations/:id/payment-request/:reqId/confirm, then post completion message in chat */}
          <button className="w-full bg-nyu-violet text-on-primary py-4 rounded-lg font-headline-sm text-headline-sm transition-transform active:scale-[0.98] shadow-md hover:opacity-90 flex justify-center items-center gap-2" type="button">
            Confirm Payment
            <span className="material-symbols-outlined">check_circle</span>
          </button>
          <button className="w-full text-center font-body-md text-body-md text-secondary hover:text-on-background transition-colors active:opacity-70" type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
