# CLAUDE.md — Messaging | VioNest

## P1 Feature: Poster–Searcher Messaging

### Description (PRD 4.1)

Clicking "Send Message" on the listing detail screen opens a 1:1 chat with the poster.

### Implementation Units

① "Send Message" button on detail screen
② New 1:1 chat creation logic

### User Story

As a searcher, I want to message the poster directly so that we can discuss details and reach an agreement.

## P1 Feature: Inbox

### Description (PRD 4.1)

A conversation is created when a searcher sends the first message; afterward, in each user's message tab, (a) a list of all connected conversation partners is shown with name + latest message preview, and (b) clicking opens that conversation.

### Implementation Units

① Inbox screen (partner list + latest message preview)
② Routing to conversation on click

### User Story

As a user, I want to see all my past and ongoing conversations in one inbox so that I can manage multiple contacts without losing track.

### Notes

- "Send Message" button on listing detail creates a new conversation
- Conversation is created on first message from searcher
- Inbox shows: all conversation partners, name + latest message preview
- Clicking opens that conversation

## Data Model (TRD 3.2)

### Conversation

| Field | Type | Required |
|---|---|---|
| id | uuid | ✅ |
| listingId | FK → Listing | ✅ |
| searcherId | FK → User | ✅ |
| posterId | FK → User | ✅ |
| createdAt | datetime | ✅ |

### Message

| Field | Type | Required |
|---|---|---|
| id | uuid | ✅ |
| conversationId | FK → Conversation | ✅ |
| senderId | FK → User | ✅ |
| content | text | ✅ |
| createdAt | datetime | ✅ |

## Backend

- `POST /conversations` (`/api/conversations`) — create new, or return existing if already opened (create/find conversation from a listing)
- `GET /conversations` (`/api/conversations`) — inbox: list distinct conversations for current user with each partner's latest message preview
- `GET /conversations/:id/messages` (`/api/conversations/:id/messages`) — message history
- `POST /conversations/:id/messages` (`/api/conversations/:id/messages`) — send message

Example:
```
POST /api/conversations/:id/messages
Request: { "content": "Hi, is this still available?" }
Response 201: { "id": "uuid", "senderId": "uuid", "content": "...", "createdAt": "2026-07-20T10:00:00Z" }
```

## Note

No real-time WebSocket is required for MVP; simple polling (re-fetch every few seconds) or page refresh is acceptable, given local-demo scope.

---
← Back to global context: documents/vionest/CLAUDE.md
