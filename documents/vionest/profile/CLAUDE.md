# CLAUDE.md — Profile | VioNest

## P0 Feature: Profile Input (Gender + Lifestyle)

### Description (PRD 4.1)

Gender (used as a hard filter for matching; options: Male / Female / Other) and lifestyle preferences (sleep schedule, smoking, cooking, pets, guest frequency) are required at sign-up (item structure allows items to be added/removed). Sleep schedule is entered as bedtime and wake-time, each selected from a 2-hour block (00–02, 02–04, ... 22–24; 12 blocks total). Guest frequency is selected from 4 levels: at least once a week / 1–2 times a month / 1–2 times a quarter / almost never. Smoking, cooking, and pets are entered as Yes/No. The gender hard filter requires an exact match (e.g., if a searcher selects "Other," only listings from posters who also selected "Other" are shown).

### Implementation Units

① Profile input screen – gender selection (Male/Female/Other)
② Sleep schedule (bedtime/wake-time, each a 12-block dropdown)
③ Smoking/cooking/pets (Y/N toggle)
④ Guest frequency (4-level selection)
⑤ Profile save logic (schema allows adding/removing items)

### User Story

As a user, I want to enter my lifestyle preferences so that I can be matched with compatible listings/tenants.

## Lifestyle Fields — Exact Input Types

- **gender**: enum `MALE` / `FEMALE` / `OTHER` — hard filter, **not** a scoring item
- **bedTimeBlock**: int 0–11 (2-hour block index)
- **wakeTimeBlock**: int 0–11 (2-hour block index)
  - 12 blocks total: 00–02, 02–04, 04–06, 06–08, 08–10, 10–12, 12–14, 14–16, 16–18, 18–20, 20–22, 22–24
- **smoking**: boolean (Yes/No)
- **cooking**: boolean (Yes/No)
- **pets**: boolean (Yes/No)
- **guestFrequency**: enum `WEEKLY` / `MONTHLY` / `QUARTERLY` / `RARE` (4 levels — at least once a week / 1–2 times a month / 1–2 times a quarter / almost never)

## Data Model: Profile (1:1 with User) — TRD 3.2

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

### Schema Note

Item structure allows adding/removing fields — keep the Prisma schema flexible for future lifestyle-field changes.

## Backend

`routes/profile.ts` + `controllers/profile.ts`:

- `POST /profile` (`/api/profile`) — create profile
- `GET /profile/me` (`/api/profile/me`) — get own profile
- `PUT /api/profile` — update profile

Data flow: form submit → `POST`/`PUT /api/profile` → Prisma upsert.

## Assumption

Profile is required before accessing any other feature after sign-up — require all fields before allowing listing creation or search.

---
← Back to global context: documents/vionest/CLAUDE.md
