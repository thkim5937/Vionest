import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import BottomNavBar from "../components/shared/BottomNavBar";
import NyuLogo from "../components/shared/NyuLogo";
import ProfileMenuButton from "../components/shared/ProfileMenuButton";
import { useAuth } from "../hooks/useAuth";
import { getConversations, ConversationSummary } from "../api/conversations";

const POLL_INTERVAL_MS = 4000;

function formatTimeLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ConversationRow({
  conversation,
  currentUserId,
  onClick,
}: {
  conversation: ConversationSummary;
  currentUserId: string | undefined;
  onClick: () => void;
}) {
  const lastMessage = conversation.lastMessage;
  const isOwnLastMessage = lastMessage?.senderId === currentUserId;

  return (
    <li
      className="flex items-start gap-4 p-4 hover:bg-surface-container-low transition-colors cursor-pointer group bg-surface"
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        {/* TODO: replace with conversation partner's avatar image */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant" />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">{conversation.otherPartyName}</h3>
          {lastMessage && (
            <span
              className={`font-label-sm text-label-sm whitespace-nowrap ml-2 ${
                isOwnLastMessage ? "text-on-surface-variant" : "text-secondary"
              }`}
            >
              {formatTimeLabel(lastMessage.createdAt)}
            </span>
          )}
        </div>
        {lastMessage ? (
          isOwnLastMessage ? (
            <p className="font-body-md text-body-md truncate text-on-surface-variant">Sent</p>
          ) : (
            <p className="font-body-md text-body-md truncate text-on-surface font-bold">{lastMessage.content}</p>
          )
        ) : (
          <p className="font-body-md text-body-md truncate text-secondary">No messages yet</p>
        )}
      </div>
    </li>
  );
}

export default function InboxPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getConversations()
      .then(setConversations)
      .catch((err) => {
        const message = isAxiosError<{ error?: string }>(err) ? err.response?.data?.error : undefined;
        setError(message ?? "Could not load your conversations. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getConversations()
        .then(setConversations)
        .catch(() => {});
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
      {/* TopAppBar (Desktop) */}
      <header className="hidden md:flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto bg-surface-container-lowest border-b border-outline-variant top-0 sticky z-50">
        <div className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-on-surface cursor-pointer active:opacity-80">
          <span>VioNest</span>
          <div className="w-px h-5 bg-outline-variant" />
          <NyuLogo size={20} />
        </div>
        <nav className="flex gap-6 items-center">
          <Link className="text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" to="/">
            Home
          </Link>
          <Link className="text-on-surface-variant font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" to="/search">
            Search
          </Link>
          <Link className="text-primary font-bold font-body-md text-body-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg" to="/inbox">
            Inbox
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ProfileMenuButton />
        </div>
      </header>

      {/* TopAppBar (Mobile) */}
      <header className="w-full top-0 sticky bg-surface z-50 md:hidden">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 w-full">
          <div className="w-8" />
          <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">Messages</div>
          <ProfileMenuButton />
        </div>
        <div className="w-full h-[1px] bg-surface-variant shadow-sm" />
      </header>

      {/* Main Content Area - Inbox List */}
      <main className="flex-grow pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-nyu-violet animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 text-center px-margin-mobile py-16">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">error_outline</span>
            <p className="font-body-md text-body-md text-on-surface-variant">{error}</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 text-center px-margin-mobile py-16">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">mail</span>
            <p className="font-body-md text-body-md text-on-surface-variant">No conversations yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-surface-variant">
            {conversations.map((conversation) => (
              <ConversationRow
                conversation={conversation}
                currentUserId={user?.userId}
                key={conversation.id}
                onClick={() => navigate(`/chat/${conversation.id}`)}
              />
            ))}
          </ul>
        )}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      {/* TODO: only pass hasUnreadMessages when there is at least one unread conversation */}
      <BottomNavBar active="messages" hasUnreadMessages />
    </div>
  );
}
