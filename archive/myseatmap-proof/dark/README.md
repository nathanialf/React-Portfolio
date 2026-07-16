# MySeatMap — Functionality Proof Recording

Captured 2026-07-16 against **https://dev.myseatmap.com**
using Playwright (Chromium 149 / Playwright 1.61.1), as a guest (unauthenticated) user.
Purpose: preserve proof of the frontend's search + seat-map functionality before the
service is discontinued.

(The production site www.myseatmap.com was used first, but its guest free tier allows
only 2 seat-map views, which were exhausted during test runs — so the final capture
was taken on the dev environment with a fresh guest session.)

The recording uses a smoothed driver: a visible on-screen pointer that glides to each
target with easing, animated (smooth-behavior) scrolling, and steady dwell times, so
the navigation reads clearly. Total length ~1m28s.

## Journey recorded (in order)
0. **Dark mode** — on the index, scroll to the footer theme toggle and switch to Dark
   first; the setting persists (next-themes / localStorage) so the whole journey is dark.
1. **Index / homepage** — `/`
2. **Plans** — `/pricing`
3. **Bookmarks example** — `/dashboard` (Preview Mode: example bookmarks, saved searches, stats)
4. **Search** — `/search`, form filled with the flight below and submitted
5. **Seat map** — "View Seat Map" opened for the returned flight

## Flight searched
- Route: **LIM → SCL** (Lima → Santiago)
- Date: **Mon, Jul 27, 2026**
- Airline / flight: **LATAM Airlines, LA 2371**
- Result: 1 non-stop flight (no connection/layover itinerary was returned, so LA 2371
  was used per instruction). "Direct only" filter left **unchecked**.
- Seat map: **MAIN Deck, 121 of 156 seats available (78%)**, with
  Available / Occupied / Blocked legend and exit rows.

## Files
- `journey.webm` — full screen recording of the journey (~37s, 1440x900). Plays in
  Chrome, Firefox, VLC. (MP4 not produced: no MP4-capable ffmpeg available on this host.)
- `screenshots/` — per-step PNGs (01–14), numbered in journey order.
- `trace.zip` — Playwright trace. View with:
  `npx playwright show-trace trace.zip`
  (interactive timeline with DOM snapshots, network, and console for every step).

## Notes
- Recorded as a guest; guest accounts get a limited number of seat-map views, which was
  sufficient for one capture.
- The script that produced this is `record.js` (kept alongside in the session scratchpad).
