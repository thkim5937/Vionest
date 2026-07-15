# CLAUDE.md — Global | VioNest

## Product

**VioNest** — an NYU-exclusive sublet matching platform where NYU students verify their identity via .edu email and a Duo Mobile authentication (UI recreation), then find or list sublets based on lifestyle-compatibility matching, and safely communicate and transact with posters.

**Core purpose**: Reduce fraud risk in sublet transactions through NYU-student-only verified matching, and increase cohabitation satisfaction through lifestyle-based matching.

## Non-Goals (Out of Scope — PRD 4.2)

| Feature | Reason for exclusion | Future consideration |
|---|---|---|
| Real payment gateway integration | MVP goal is to demo the core local flow, replaced with a mocked payment UI | Consider for real service launch |
| Real Duo Mobile API integration | Same reason — only the authentication UI is recreated | Consider for real service launch |
| Real email verification (SMTP/code verification) | Goal is seamless local operation, replaced with domain-format checking | Consider for real service launch |
| Address-based automatic reverse-distance calculation (geocoding API) | Goal is seamless local operation without external API integration, replaced with manual poster input | Consider for real service launch |
| Individual roommate accounts / follow-up logic | Implementing per-roommate account creation and "currently cohabiting" relationship logic was judged too costly; replaced with the assumption that "a poster and their existing roommates already cohabit, so their lifestyles are reasonably compatible" | May be revisited in future team development |
| Review/rating system | Not discussed, out of MVP scope | May be considered in the future |
| Contract e-signature | Not discussed, out of MVP scope | May be considered in the future |
| Expansion to other schools | NYU-exclusive positioning is the core value proposition, out of MVP scope | May be considered in the future |

## Design Guidelines

- **UI language**: All UI text (authentication screens, menus, buttons, etc.) is written in English
- **Brand color**: NYU's official brand color, NYU Violet (**#57068C**, Pantone 2597), applied to key interactive elements such as menu tabs and selected/active tabs
- **Logo**: The NYU logo is placed alongside the main VioNest logo wherever it appears
- **Overall layout/tone**: Implemented in a StreetEasy-like style (card-based listing lists, detail-page layout, etc.)

## Tech Stack (TRD Section 1)

| Area | Choice | Rationale |
|---|---|---|
| Frontend | React + Vite + TypeScript, Tailwind CSS | UI is component-heavy (cards, 2-step dropdowns, chat, a 3-step full-page SSO mock); no SSR/SEO need for a local demo; Tailwind makes NYU Violet (#57068C) theming quick |
| Backend | Node.js + Express + TypeScript (REST) | Stateful APIs for auth, match scoring, messaging, mock payment; same language as frontend reduces solo-dev context switching |
| Database | SQLite + Prisma ORM | Zero-config, file-based, sufficient for demo scale; type-safe schema/queries |
| Auth | JWT (httpOnly cookie) + bcrypt | Stateless session persistence; the NYU/Duo SSO sequence is a pure front-end UI recreation with no backend calls until final account creation |
| External API | None | Duo Mobile, email verification, payment, and distance calculation are all mocked per PRD 4.2 |
| Deployment | Vercel (frontend) + Render free tier (backend + SQLite) | Simplest low-cost path to a shareable demo link |
| Dev Environment | macOS, VS Code | — |

## System Architecture Overview (TRD 2.1)

React SPA (Vite) ↔ Express REST API ↔ SQLite via Prisma.

The entire NYU/Duo SSO mock sequence (3 steps) runs client-side only, as local React state — no network calls, no real Duo/Microsoft endpoint contact. Only after the sequence completes and the user sets their actual app password does the frontend call the backend to persist the account. JWT is issued on login and stored in an httpOnly cookie, validated by Express middleware on every protected request. Photo uploads go through multer to Express, saved to /uploads, served statically, with URLs recorded on Listing.

Typical flow: user action in React → API call (fetch/axios) → Express controller → Prisma query against SQLite → JSON response → React state update → re-render.

## Completion Criteria / Success Metrics (PRD Section 6)

| Metric | Definition | MVP Target | Completion Criteria |
|---|---|---|---|
| Core flow works correctly (top priority) | Whether data integration across both the poster and searcher sides, and between the two flows, works without errors in the local environment | 100% (demoable end-to-end without errors) | Considered complete when all of the following are met: ① Poster flow: sign-up → verification → profile input → listing info input → checking/responding to messages in the inbox, completed with no console errors. ② Searcher flow: sign-up → verification → profile input → search/filter/match-sort → view detail → send message, completed with no console errors. ③ Integration check (P0/P1 scope): the listing newly created in ① appears correctly in the search results in ② → the searcher sends a message to the poster from the listing detail → the poster confirms and responds to the message in the inbox — all completed in one continuous run with no console errors. ④ Integration check (P2 extension, optional): after ③, the poster sends a payment request in the chat → the searcher selects a payment method (mock) and clicks "Confirm Payment" on the confirmation screen → a completion message appears in the chat — all completed in one continuous run with no console errors (included in the completion criteria only if the P2 feature is implemented) |
| Match-sort accuracy (second priority) | Whether, based on the weighting/interval formula defined in 4.1, search results are sorted in exact descending order of match score | 100% (zero sorting errors across arbitrary test cases) | Across 10+ test cases with different profile combinations, the manually calculated match score and the on-screen sort order match 100% |

*(Note: real-world operational metrics such as user acquisition or retention are out of scope, since this MVP's purpose is to demonstrate project experience.)*

## Constraints & Assumptions (PRD Section 7)

### Constraints

- Solo development project; no fixed deadline
- Not intended for actual service launch or user acquisition — an MVP recreation project for portfolio purposes (the original idea will be separately developed further by the team lead; this project ends at MVP implementation without further idea expansion)
- Accordingly, all features target seamless operation in a local environment as the completion bar, not production-level deployment, security, or scalability
- Features that would require external API integration (payment, Duo Mobile authentication, email verification, reverse-distance calculation, etc.) are replaced with mocks/manual input instead of real integration (see 4.2 Out of Scope)
- The product UI is implemented in English (all UI text — authentication screens, menus, buttons, etc. — is written in English)

### Assumptions

- A poster and their existing roommate(s), already living together, are assumed to already have a reasonably compatible lifestyle since they cohabit; accordingly, matching with a searcher is calculated based solely on the poster's own profile. This is a settled decision within this MVP's scope; individual roommate profiles/follow-up logic will only be reconsidered in future team development beyond the MVP. Listings only record the number of residents; individual roommates' lifestyle preferences are neither collected nor factored into matching.
- Gender is applied as a required-match condition (hard filter), not a weighted matching item; listings of a gender different from the searcher's are not shown in search results. Gender options are Male / Female / Other, and the hard filter requires an exact match.
- For the remaining lifestyle items (excluding gender), weights are: sleep schedule 5, pets 4, smoking 3, guest frequency 2, cooking 1 (15 points total); the detailed calculation method follows PRD Section 4.1.
- The location filter uses a fixed borough → neighborhood 2-step dropdown list; neighborhoods not on the list are categorized as "Other."
- The nearest-station distance is trusted as-is from the poster's free-text input, with no separate validation logic.
- Payment and email verification are recreated as mocks without real API integration. The Duo authentication step is a UI recreation only — no real Duo Mobile API call is made, and the password entered during the mock SSO sequence (Step 2) is not stored or validated; it is separate from the user's actual app account password.

## Folder Map

- [`auth/`](auth/CLAUDE.md) — NYU authentication & session management (mock SSO, JWT, login/logout)
- [`profile/`](profile/CLAUDE.md) — Gender + lifestyle profile input
- [`listing/`](listing/CLAUDE.md) — Sublet listing creation (photos, location, price, etc.)
- [`search/`](search/CLAUDE.md) — Filtered search, match-score sorting, listing detail + poster info
- [`messaging/`](messaging/CLAUDE.md) — Poster–searcher 1:1 messaging + inbox
- [`payment/`](payment/CLAUDE.md) — Mock payment request flow (P2)
- [`shared/`](shared/CLAUDE.md) — Reusable UI components, theming, design tokens
- [`db/`](db/CLAUDE.md) — Prisma schema, data model, database conventions

**Note**: Read the relevant subfolder CLAUDE.md before working on any feature.
