# CLAUDE.md — Listing | VioNest

## P0 Feature: Listing Creation

### Description (PRD 4.1)

A poster enters sublet listing information to create a post. Required fields: photos (at least 1, local upload), location (borough → neighborhood 2-step dropdown, see Table 4.1-1), price (monthly rent, numeric), move-in date (date picker), nearest subway station (free-text input), and number of residents (numeric). Listing creation is only available to users who have completed authentication and profile input. Once created, the listing immediately appears in search results.

### Implementation Units

① Listing creation screen
② Photo upload (local, min. 1 photo)
③ Location 2-step dropdown
④ Price / move-in date / number-of-residents input fields
⑤ Nearest-station free-text input field
⑥ Post save logic
⑦ Integration so the listing appears in search results

### User Story

As a poster, I want to list my sublet with photos, location, price, and move-in date so that searchers can find and evaluate it.

## Required Listing Fields

- **photos**: `string[]` JSON, min. 1, local upload via multer → `/uploads/`
- **borough**: enum (Manhattan / Brooklyn / Queens / Bronx / Staten Island)
- **neighborhood**: string (from fixed list per borough — Table 4.1-1 below)
- **price**: int (monthly rent USD)
- **moveInDate**: date
- **nearestStation**: string (free text, no validation)
- **residentCount**: int

## Table 4.1-1 — Borough → Neighborhood Mapping

| Borough (Level 1) | Neighborhood (Level 2) |
|---|---|
| Manhattan | Greenwich Village, East Village, Lower East Side, Chelsea, Union Square/Gramercy, Upper East Side, Upper West Side, Harlem, Financial District, Other |
| Brooklyn | Williamsburg, Bushwick, Park Slope, Brooklyn Heights, Bed-Stuy, DUMBO, Other |
| Queens | Astoria, Long Island City, Flushing, Other |
| Bronx | Other |
| Staten Island | Other |

## Data Model: Listing (TRD 3.2)

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

## Photo Upload

Multer middleware handles multipart upload, saves files to `/uploads/`, served statically; resulting URLs are stored in `Listing.photos`.

## Backend

`routes/listings.ts` + `controllers/listings.ts`:

- `POST /listings` (`/api/listings`) — create listing (multipart, photos); guard behind completed auth + profile; validate ≥1 photo
- `GET /listings/:id` (`/api/listings/:id`) — listing + poster detail

Data flow: form submit w/ files → `POST /api/listings` → multer saves files → Prisma creates Listing → immediately visible via `GET /api/listings`.

## Rule

Listing creation is only available after auth + profile completion.

## Non-Goal Reminder

No geocoding API — `nearestStation` is free text trusted as-is from the poster's input, with no separate validation logic.

---
← Back to global context: documents/vionest/CLAUDE.md
