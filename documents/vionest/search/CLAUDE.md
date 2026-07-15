# CLAUDE.md — Search | VioNest

## P1 Feature: Filtered Search + Match-Score Sorting

### Description (PRD 4.1)

Searchers filter listings by location (borough → neighborhood 2-step dropdown; see Table 4.1-1) and price (min–max, direct numeric input), then view results sorted by match score based on a lifestyle comparison with posters. Gender is applied as a hard filter, so only listings from posters of the same gender as the searcher are shown.

### Implementation Units

① Search screen (location 2-step dropdown, price min–max input)
② Gender hard-filter logic
③ Match-score calculation logic (5-item weighted scoring)
④ Result list sorted rendering

### User Story

As a searcher, I want to see only same-gender listings sorted by lifestyle compatibility so that I find the most suitable and comfortable option quickly.

## Filter Inputs

- **location**: 2-step dropdown (borough → neighborhood), same Table 4.1-1 list as Listing Creation
- **price**: min–max numeric input

## Hard Filter

Gender must exactly match the searcher's gender (`MALE`/`FEMALE`/`OTHER`) — listings of a different gender are never shown in search results.

## Match Score Algorithm (PRD 4.1, full formula)

**Weights** (15 points total):

| Item | Weight |
|---|---|
| Sleep schedule | 5 |
| Pets | 4 |
| Smoking | 3 |
| Guest frequency | 2 |
| Cooking | 1 |

- **pets / smoking / cooking**: full weight on exact match, 0 on mismatch
- **sleep schedule**: circular distance (max 6 blocks) computed separately for bedtime and wake-time; `score = 1 − (block difference ÷ 6)` for each; average the two scores, then multiply by weight (5)
- **guest frequency** (4 levels): 0-level difference = 100%, 1-level difference = 50%, 2+-level difference = 0%, multiplied by weight (2)
- **final match score** = (sum of points earned across the 5 items) ÷ 15 × 100

Result list is sorted **descending** by match score.

## Backend

`services/matchScore.ts` computes the score server-side; gender hard filter applied in Prisma `where` clause; sort applied in application code.

```
GET /api/listings?borough=&neighborhood=&minPrice=&maxPrice=
```

Example response:
```json
{
  "listings": [
    { "id": "uuid", "posterName": "Minjun Park", "borough": "Manhattan", "neighborhood": "East Village", "price": 1800, "matchScore": 87.3 }
  ]
}
```

## P1 Feature: Listing Detail + Poster Info

### Description

Search results show summary info (building name, poster name, move-in date, address, distance to nearest station, number of residents, etc.); clicking opens full listing + poster details (StreetEasy-style layout plus poster info).

### Implementation Units

① List card component (summary: building name, poster name, move-in date, address, nearest station, residents, price, match score badge)
② Detail screen (full listing info + poster lifestyle info summary)

### User Story

As a searcher, I want to see listing and poster details so that I can decide whether to reach out.

### Backend

`GET /listings/:id` (`/api/listings/:id`) — listing joined with poster's public profile fields.

## Success Metric (PRD Section 6)

Match-sort accuracy: 100% sort accuracy — across 10+ test cases with different profile combinations, the manually calculated match score and the on-screen sort order must match 100%.

---
← Back to global context: documents/vionest/CLAUDE.md
