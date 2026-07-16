import NyuVerifiedBadge from "../components/shared/NyuVerifiedBadge";

export default function ChatPage() {
  return (
    <div className="bg-background text-on-background h-screen flex flex-col font-body-md text-body-md overflow-hidden">
      {/* Top App Bar (Chat specific) */}
      <header className="bg-surface border-b border-surface-variant flex items-center justify-between px-margin-mobile py-4 w-full sticky top-0 z-50">
        <button className="text-on-surface hover:bg-surface-container-low p-2 rounded-full transition-colors active:scale-95 duration-150" type="button">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          {/* TODO: bind to conversation partner name + NYU-verified status */}
          <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            David
            <NyuVerifiedBadge />
          </h1>
          {/* TODO: bind to conversation's listing name */}
          <p className="text-secondary font-label-sm text-label-sm">Gramercy Green</p>
        </div>
        <button className="text-on-surface hover:bg-surface-container-low p-2 rounded-full transition-colors active:scale-95 duration-150" type="button">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      {/* Chat Canvas */}
      {/* TODO: replace with GET /api/conversations/:id/messages (polling/refresh acceptable per messaging/CLAUDE.md) */}
      <main className="flex-1 overflow-y-auto px-margin-mobile py-4 flex flex-col gap-4">
        <div className="flex justify-center">
          <span className="text-secondary font-label-sm text-label-sm bg-surface-container-low px-3 py-1 rounded-full">Today 10:42 AM</span>
        </div>

        <div className="flex justify-end mb-2">
          <div className="bg-nyu-violet text-on-primary max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-2 shadow-sm">
            <p>Hi David, I'm interested in the room! Is it still available for August?</p>
          </div>
        </div>

        <div className="flex justify-start mb-2">
          <div className="bg-surface-container text-on-surface max-w-[75%] rounded-2xl rounded-tl-sm px-4 py-2 border border-surface-variant shadow-sm">
            <p>Hey! Yes, it's still available.</p>
          </div>
        </div>

        <div className="flex justify-end mb-2">
          <div className="bg-nyu-violet text-on-primary max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-2 shadow-sm">
            <p>I can come by for a viewing on Tuesday.</p>
          </div>
        </div>

        <div className="flex justify-center mt-2 mb-2">
          <span className="text-secondary font-label-sm text-label-sm bg-surface-container-low px-3 py-1 rounded-full">11:05 AM</span>
        </div>

        <div className="flex justify-start mb-2">
          <div className="bg-surface-container text-on-surface max-w-[75%] rounded-2xl rounded-tl-sm px-4 py-2 border border-surface-variant shadow-sm">
            <p>Tuesday at 5 PM works for me. Does that fit your schedule?</p>
          </div>
        </div>

        {/* System Message / Payment Request (P2, poster-only affordance) */}
        {/* TODO: wire onClick -> POST /conversations/:id/payment-request (see payment/CLAUDE.md) */}
        <div className="flex justify-center my-4">
          <button className="bg-surface-container-lowest border border-nyu-violet text-nyu-violet hover:bg-primary-fixed-dim px-6 py-2 rounded-full font-label-sm text-label-sm flex items-center gap-2 transition-colors active:scale-95 duration-150 shadow-sm" type="button">
            <span className="material-symbols-outlined text-[18px]">payments</span>
            Request Payment
          </button>
        </div>
      </main>

      {/* Bottom Input Area */}
      <footer className="bg-surface border-t border-surface-variant p-margin-mobile flex items-center gap-3">
        <button className="text-secondary hover:text-primary transition-colors p-2 rounded-full active:scale-95" type="button">
          <span className="material-symbols-outlined">add_circle</span>
        </button>
        <div className="flex-1 bg-surface-container-low rounded-full flex items-center px-4 py-2 border border-surface-variant focus-within:border-nyu-violet focus-within:ring-1 focus-within:ring-nyu-violet transition-all">
          {/* TODO: bind to message draft state */}
          <input
            className="bg-transparent border-none focus:ring-0 w-full font-body-md text-body-md text-on-surface placeholder:text-secondary p-0"
            placeholder="Type a message..."
            type="text"
          />
        </div>
        {/* TODO: wire onClick -> POST /conversations/:id/messages */}
        <button className="bg-nyu-violet text-on-primary p-3 rounded-full hover:opacity-90 transition-colors active:scale-90 flex items-center justify-center shadow-md" type="button">
          <span className="material-symbols-outlined">send</span>
        </button>
      </footer>
    </div>
  );
}
