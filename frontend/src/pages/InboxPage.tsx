type ConversationPreview = {
  id: string;
  partnerName: string;
  listingName: string;
  lastMessage: string;
  timeLabel: string;
  unreadCount: number;
};

// TODO: replace with GET /api/conversations response
const SAMPLE_CONVERSATIONS: ConversationPreview[] = [
  { id: "1", partnerName: "David", listingName: "Gramercy Green", lastMessage: "Hey! Is the room still available for August?", timeLabel: "2:30 PM", unreadCount: 1 },
  { id: "2", partnerName: "Sarah", listingName: "The Palladium", lastMessage: "The viewing is scheduled for tomorrow at 5.", timeLabel: "11:45 AM", unreadCount: 0 },
  { id: "3", partnerName: "Michael", listingName: "Washington Square Village", lastMessage: "Thanks for the info, I'll let you know.", timeLabel: "Yesterday", unreadCount: 0 },
  { id: "4", partnerName: "Jessica", listingName: "East Village Loft", lastMessage: "I've uploaded the new photos of the kitchen.", timeLabel: "Monday", unreadCount: 0 },
];

function ConversationRow({ conversation }: { conversation: ConversationPreview }) {
  const isUnread = conversation.unreadCount > 0;

  return (
    <li
      className={`flex items-start gap-4 p-4 hover:bg-surface-container-low transition-colors cursor-pointer group ${
        isUnread ? "bg-surface-bright" : "bg-surface"
      }`}
    >
      <div className="relative flex-shrink-0">
        {/* TODO: replace with conversation partner's avatar image */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant" />
        {isUnread && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-nyu-violet text-on-primary rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold border-2 border-surface-bright">
            {conversation.unreadCount}
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">{conversation.partnerName}</h3>
          <span className={`font-label-sm text-label-sm whitespace-nowrap ml-2 ${isUnread ? "text-nyu-violet font-semibold" : "text-secondary"}`}>
            {conversation.timeLabel}
          </span>
        </div>
        <p className="font-label-sm text-label-sm text-secondary mb-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">apartment</span>
          {conversation.listingName}
        </p>
        <p className={`font-body-md text-body-md truncate ${isUnread ? "text-on-surface font-medium" : "text-secondary"}`}>{conversation.lastMessage}</p>
      </div>
    </li>
  );
}

export default function InboxPage() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky bg-surface z-50">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 w-full">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary cursor-pointer active:scale-95 duration-150">menu</span>
          </div>
          <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">Messages</div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-surface-variant cursor-pointer active:scale-95 duration-150">
            {/* TODO: replace with current user's avatar image */}
            <div className="w-full h-full bg-surface-variant" />
          </div>
        </div>
        <div className="w-full h-[1px] bg-surface-variant shadow-sm" />
      </header>

      {/* Main Content Area - Inbox List */}
      <main className="flex-grow pb-20">
        <ul className="divide-y divide-surface-variant">
          {SAMPLE_CONVERSATIONS.map((conversation) => (
            <ConversationRow conversation={conversation} key={conversation.id} />
          ))}
        </ul>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface border-t border-surface-variant shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        <div className="flex justify-around items-center h-16 w-full px-4 pb-safe">
          {/* Search (Inactive) */}
          <div className="flex flex-col items-center justify-center text-secondary hover:bg-surface-container-low active:scale-90 transition-transform duration-200 cursor-pointer w-16 h-full rounded-lg">
            <span className="material-symbols-outlined mb-1">search</span>
            <span className="font-label-sm text-label-sm">Search</span>
          </div>
          {/* Messages (Active) */}
          <div className="flex flex-col items-center justify-center text-primary font-bold active:scale-90 transition-transform duration-200 cursor-pointer w-16 h-full rounded-lg relative">
            {/* Badge for unread total */}
            {/* TODO: only render when there is at least one unread conversation */}
            <div className="absolute top-1 right-2 w-2 h-2 bg-nyu-violet rounded-full" />
            <span className="material-symbols-outlined mb-1 [font-variation-settings:'FILL'_1]">chat_bubble</span>
            <span className="font-label-sm text-label-sm">Messages</span>
          </div>
          {/* Profile (Inactive) */}
          <div className="flex flex-col items-center justify-center text-secondary hover:bg-surface-container-low active:scale-90 transition-transform duration-200 cursor-pointer w-16 h-full rounded-lg">
            <span className="material-symbols-outlined mb-1">person</span>
            <span className="font-label-sm text-label-sm">Profile</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
