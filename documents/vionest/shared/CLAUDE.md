# CLAUDE.md — Shared | VioNest

## Reusable UI Components (used across multiple features)

- **NYU Violet theme token**: `#57068C` (Tailwind custom color)
- **NYU logo** (torch icon + wordmark): used in auth screens and alongside the main VioNest logo
- **StreetEasy-inspired card component pattern**: used for listing lists and detail pages
- **Bottom navigation bar**: Search / Messages / Profile tabs
- **NYU Verified badge**: checkmark icon in NYU Violet
- **Match score badge**: NYU Violet background (used in search results and listing detail)
- **2-step borough → neighborhood dropdown component**: used in both listing creation and search (see Table 4.1-1 in [listing/CLAUDE.md](../listing/CLAUDE.md) and [search/CLAUDE.md](../search/CLAUDE.md))

## Design Rules

- All UI text in English
- NYU Violet (`#57068C`) for all primary buttons, active tabs, badges, highlights
- StreetEasy-like layout: card-based lists, structured detail pages
- NYU logo placed alongside the VioNest logo wherever the main logo appears

## Frontend Assets Location

`frontend/src/assets/`
- NYU torch logo PNG
- Duo icon PNG

## Tailwind Config

Extend theme with `nyuViolet: '#57068C'`.

---
← Back to global context: documents/vionest/CLAUDE.md
