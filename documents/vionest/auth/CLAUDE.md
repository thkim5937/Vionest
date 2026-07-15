# CLAUDE.md — Auth | VioNest

## P0 Feature: NYU Authentication & Session Management

### Description (PRD 4.1)

.edu email verification is mocked via domain-format checking (@nyu.edu) instead of sending a real verification email. On the sign-up screen, the user enters their NetID email (NetID@nyu.edu) into the email field, which has a "Verify" button to its right. Clicking "Verify" launches a **3-step sequence** that visually recreates NYU's real SSO screens (NYU torch logo, Microsoft-login-style card, Duo Push card) as full-page steps:

**Step 1 — Identity confirmation**: shows the entered email at the top, a "Confirm your identity" heading, and a notice: "Approved via MFA (Duo) — you will be redirected to complete sign-in," followed by a fixed static warning/help block ("ATTENTION: Do not use your personal email. Sign in with your NetID followed by @nyu.edu, then your NYU password," plus non-functional helper links: Need Help?, Troubleshooting tips, Accessibility, Policy on Responsible Use of NYU Computers and Data).

**Step 2 — Password entry (SSO mock only)**: shows the email again with a back arrow, an "Enter password" heading, a password field, a "Forgotten or expired password?" link (non-functional), and a "Sign in" button, with the same warning block below; this field is a visual mock only, any non-empty input is accepted and not stored (it is not the app account password).

**Step 3 — Duo Push confirmation**: recreates Duo's push card — NYU logo header, "Duo Push confirmation" heading, instruction text, a line showing the mock device ("Sent to 'iOS' (••-••-••••-5937)"), a Duo icon with an animated spinner already shown in progress on load (no separate send button), an "Other options" link and a "Need help?" link (both non-functional); after 3–5s of spinner animation, authentication auto-completes.

After Step 3, the user returns to the sign-up screen (email now marked verified) and sets their actual app account password to complete registration. This 3-step sequence runs only once, at initial sign-up. Afterward, the user logs in with email + app password; login persists the session, and the user can log out from the menu.

### Implementation Units

① Sign-up screen (.edu email input + "Verify" button + app account password input, shown after verification)
② Mock SSO Step 1 — identity confirmation screen
③ Mock SSO Step 2 — password entry screen (mock only, not stored)
④ Mock SSO Step 3 — Duo Push confirmation screen (spinner pre-started, auto-complete after 3–5s)
⑤ Return-to-signup logic (email marked verified) + app account password creation
⑥ Login screen (email + app password)
⑦ Session persistence logic
⑧ Logout function

### User Story

As an NYU student, I want to sign up once with .edu + Duo-style verification and then log in/out normally afterward, so that I don't repeat the full verification flow every visit.

## Mock SSO Rules

- Domain-format check only (`@nyu.edu`) — no real email is ever sent
- Step 2 password is never stored or validated — any non-empty input is accepted and discarded, not persisted anywhere (not even in memory beyond the component); it is discarded once Step 3 begins
- Step 3 auto-completes after 3–5s of spinner animation (spinner starts immediately on mount, not on a button click; use a cancellable timer)
- The full 3-step sequence runs only **once**, at initial sign-up. Subsequent visits use email + app password (plain login, no SSO replay)
- All decorative links (Need Help?, Troubleshooting tips, Accessibility, Policy on Responsible Use, Forgotten password, Other options) must remain non-functional/static — do not wire real navigation or handlers

## Data Model: User (TRD 3.2)

| Field | Type | Required | Description |
|---|---|---|---|
| id | uuid | ✅ | PK |
| email | string | ✅ | must match NetID@nyu.edu format |
| passwordHash | string | ✅ | bcrypt hash of the actual app password (set after the SSO mock sequence, not the mock password from Step 2) |
| isVerified | boolean | ✅ | set true once the 3-step mock sequence completes |
| createdAt | datetime | ✅ | |

*(No table stores the mock Step 2 password — per PRD 7.2, it is never persisted or validated.)*

## Auth Tech Details (TRD)

- **Auth**: JWT (httpOnly cookie) + bcrypt — stateless session persistence
- The NYU/Duo SSO mock sequence (3 steps) is a **pure client-side React state machine** (`useSsoMockFlow` hook driving step1 → step2 → step3 → verified) — zero backend calls until the final account-creation step
- Only after Step 3 completes and the user sets their actual app password does the frontend call the backend to persist the account (`POST /api/auth/signup`)
- JWT is issued on login and stored in an httpOnly cookie, validated by Express middleware on every protected request
- Security: passwords hashed with bcrypt; JWT secret in `.env`; Step 2's mock password must never reach the backend or be logged; not hardened for production (no rate limiting/CSRF/enforced HTTPS) — out of scope per PRD 7.1

## Frontend Components

- `SignupForm.tsx`
- `SsoMockStep1Identity.tsx`
- `SsoMockStep2Password.tsx`
- `SsoMockStep3DuoPush.tsx`
- `hooks/useAuth.ts`
- `hooks/useSsoMockFlow.ts` (state: step1 → step2 → step3 → verified)
- `LoginForm` (plain email + app password)

## Backend

To be defined in `routes/auth.ts` + `controllers/auth.ts`:

- `POST /auth/register` (a.k.a. `/api/auth/signup`) — validate .edu format + uniqueness, hash password, create User(isVerified=true); request fires only after the 3-step mock sequence completes client-side
- `POST /auth/login` (`/api/auth/login`) — email+password login, sets JWT cookie
- `POST /auth/logout` (`/api/auth/logout`) — clear session
- `GET /auth/me` — get current session user

Example:
```
POST /api/auth/signup
Request: { "email": "jk1234@nyu.edu", "password": "••••••••" }
Response 201: { "userId": "uuid", "isVerified": true }
```

## Non-Goals Reminder

No real Duo API integration, no real email verification/SMTP. The Duo authentication step is a UI recreation only.

---
← Back to global context: documents/vionest/CLAUDE.md
