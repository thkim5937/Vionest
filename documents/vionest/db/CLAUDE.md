# CLAUDE.md — DB | VioNest

## Database

SQLite + Prisma ORM (TRD Section 1).

**Rationale**: Zero-config, file-based, sufficient for demo scale; type-safe schema/queries.

## Prisma Schema File Location

`backend/src/prisma/schema.prisma`

## Table Definitions (TRD 3.2)

### User

| Field | Type | Required | Description |
|---|---|---|---|
| id | uuid | ✅ | PK |
| email | string | ✅ | must match NetID@nyu.edu format |
| passwordHash | string | ✅ | bcrypt hash of the actual app password (set after the SSO mock sequence, not the mock password from Step 2) |
| isVerified | boolean | ✅ | set true once the 3-step mock sequence completes |
| createdAt | datetime | ✅ | |

*(No table stores the mock Step 2 password — per PRD 7.2, it is never persisted or validated.)*

### Profile (1:1 with User)

| Field | Type | Required | Description |
|---|---|---|---|
| id | uuid | ✅ | PK |
| userId | FK → User | ✅ | unique |
| gender | enum(MALE/FEMALE/OTHER) | ✅ | hard filter |
| bedTimeBlock | int (0–11) | ✅ | 2-hour block index |
| wakeTimeBlock | int (0–11) | ✅ | 2-hour block index |
| smoking | boolean | ✅ | |
| cooking | boolean | ✅ | |
| pets | boolean | ✅ | |
| guestFrequency | enum(WEEKLY/MONTHLY/QUARTERLY/RARE) | ✅ | 4-level |

### Listing

| Field | Type | Required | Description |
|---|---|---|---|
| id | uuid | ✅ | PK |
| posterId | FK → User | ✅ | |
| photos | string[] (JSON) | ✅ | min. 1 |
| borough | enum | ✅ | Table 4.1-1 |
| neighborhood | string | ✅ | |
| price | int | ✅ | |
| moveInDate | date | ✅ | |
| nearestStation | string | ✅ | free text |
| residentCount | int | ✅ | |
| createdAt | datetime | ✅ | |

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

### PaymentRequest (P2)

| Field | Type | Required |
|---|---|---|
| id | uuid | ✅ |
| conversationId | FK → Conversation | ✅ |
| amount | int | ✅ |
| status | enum(PENDING/COMPLETED) | ✅ |
| createdAt | datetime | ✅ |

## ERD Relationships

- User 1:1 Profile
- User 1:N Listing (as poster)
- User + Listing → Conversation
- Conversation 1:N Message
- Conversation 1:N PaymentRequest (P2)

## Key Constraints

- `User.email` must match `NetID@nyu.edu` format
- `User.passwordHash` stores bcrypt hash of the app password only (mock Step 2 SSO password is never stored — PRD 7.2)
- `Profile.bedTimeBlock` and `wakeTimeBlock` are int 0–11 (block index, not time string)
- `Listing.photos` is `string[]` stored as JSON
- `Listing.borough` is enum; `Listing.neighborhood` is a free string from the fixed list (Table 4.1-1)

## Migration Approach

`prisma migrate dev` for local development.

## Note

SQLite is file-based; the database file lives at `backend/prisma/dev.db`.

---
← Back to global context: documents/vionest/CLAUDE.md
