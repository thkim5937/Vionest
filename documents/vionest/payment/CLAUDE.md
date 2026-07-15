# CLAUDE.md — Payment | VioNest

## P2 Feature: Payment Request Flow (Mock)

### Priority

**P2 (Nice to have)** — implement only after all P0/P1 features are complete.

### Description (PRD 4.1)

When a poster sends a payment request in chat, the amount field defaults to the listed price but can be edited by the poster. When the searcher clicks the request, a payment-method selection screen (mock; no real input form) appears — e.g., card / bank transfer. On a confirmation screen summarizing the amount, listing name, and payment method, the searcher must click "Confirm Payment" to finalize. Upon completion, a completion message is posted in the chat (no real payment API is integrated).

### Implementation Units

① Payment-request form in chat (amount default + editable)
② Payment-method selection screen (mock)
③ Payment confirmation screen (summary)
④ Completion processing and completion message

### User Story

As a poster, I want to send a payment request in chat so that the searcher can confirm and "complete" payment within the same flow.

## Flow

1. Poster sends payment request in chat (amount defaults to listing price, editable)
2. Searcher clicks request → payment method selection screen (mock, no real form). Options: Credit/Debit Card, Bank Transfer (ACH), Venmo, Zelle
3. Confirmation screen: amount + listing name + payment method summary
4. Searcher clicks "Confirm Payment" → completion message posted in chat

## Data Model: PaymentRequest (TRD 3.2)

| Field | Type | Required |
|---|---|---|
| id | uuid | ✅ |
| conversationId | FK → Conversation | ✅ |
| amount | int | ✅ |
| status | enum(PENDING/COMPLETED) | ✅ |
| createdAt | datetime | ✅ |

## Backend

- `POST /conversations/:id/payment-request` (`/api/conversations/:id/payment-request`) — create payment request
- `POST /conversations/:id/payment-request/:reqId/confirm` (`/api/payment-requests/:id/confirm`) — confirm mock payment

Implementation: chat-embedded amount form (defaults to listing price, editable) → mock payment-method screen → confirmation summary → confirm posts a system "Payment completed" message.

Dependency: Messaging (must be implemented first).

## Non-Goal Reminder

No real payment API integration; no real card/bank input fields.

## Success Criteria (P2, optional — PRD Section 6)

Integration check ④: after the P0/P1 integration check, the poster sends a payment request in the chat → the searcher selects a payment method (mock) and clicks "Confirm Payment" on the confirmation screen → a completion message appears in the chat — all completed in one continuous run with no console errors. (Included in completion criteria only if the P2 feature is implemented.)

---
← Back to global context: documents/vionest/CLAUDE.md
