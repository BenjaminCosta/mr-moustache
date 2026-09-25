# Mr Moustache Barbershop

Brand landing for Mr Moustache Barbershop and its two Gold Coast shops,
Surfers Paradise and Broadbeach, plus a `/work-with-us` careers page.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Before launch

1. Copy `.env.example` to `.env.local` and replace every placeholder URL.
2. Confirm each shop's address, phone and opening hours in
   `src/data/locations.ts` (Surfers Paradise hours are still a marked
   placeholder), and services/prices in `src/data/services.ts`.
3. Add the background photography and the "Our Work" clip: drop the files in
   `public/images/backgrounds` and set their paths in `src/data/media.ts`
   (every slot falls back to a dark gradient while it is `null`).
4. Confirm the metadata in `src/app/layout.tsx` and the LocalBusiness JSON-LD in
   `src/lib/structured-data.ts`. The full SEO plan lives in `docs/SEO_PLAN.md`.

Booking calls to action read from `src/lib/constants.ts`:
`SQUARE_BOOKING_URL` for the general "Book Now" buttons and
`SQUARE_BOOKING_URL_SURFERS_PARADISE` / `SQUARE_BOOKING_URL_BROADBEACH` for each
shop's buttons. Until each shop has its own Square deep link, both fall back to
the shared Square site.

## Work With Us form

`/work-with-us` posts to a Server Action (`src/app/work-with-us/actions.ts`)
that validates the fields and emails the application through
[Resend](https://resend.com) (plain `fetch`, no extra dependency). To turn it on,
set in Vercel:

- `RESEND_API_KEY`: API key from a Resend account.
- `WORK_WITH_US_TO_EMAIL`: the client's inbox (comma-separated for several).
- `WORK_WITH_US_FROM_EMAIL` (optional): a sender on a domain verified in
  Resend, e.g. `Mr Moustache <jobs@yourdomain.com>`. Without it Resend's test
  sender `onboarding@resend.dev` is used, which only delivers to the Resend
  account owner.

Until those variables exist, the form validates as normal but tells the visitor
that online applications aren't connected yet, so nothing is lost silently.

## Approved design foundation

- Display type: Cherry Swash for H1, H2 and selected service names.
- Body/UI type: Instrument Sans.
- Accent script: Comforter Brush, only for the hand-lettered "Gold Coast" and
  "Good Hair Better People" taglines.
- Palette: black `#000000`, dark grey `#1E1E1E`, cold white `#EFF4F5`,
  cyan `#10C0D9` and dark teal `#006C80`.
- Direction: classic barber with modern execution; dark, editorial and clean.
- Small corner radius, thin lines, simple cards and large real photography.

## Page structure

Built mobile-first from the mockups in `mr-moustache-material/` (drawn at a
390px viewport; below that width the root font size scales so every section
keeps its proportions).

1. Hero with the Surfers Paradise / Broadbeach selector
   (`src/components/sections/Hero.tsx`; header in
   `src/components/layout/SiteHeader.tsx`)
2. Services + Prices (`src/components/sections/Services.tsx`)
3. Our Work (`src/components/sections/OurWork.tsx`)
4. Reviews / Reputation (`src/components/sections/Reputation.tsx`)
5. Find Us, both shops with hours and directions; anchors `#surfers-paradise`
   and `#broadbeach` (`src/components/sections/Location.tsx`)
6. Footer (`src/components/layout/Footer.tsx`)

### Google reviews

Ratings and review counts for both locations live in `src/data/reviews.ts`
(`googleRatings`). The `reviews` array contains short excerpts from verified
public Google reviews for Broadbeach and Surfers Paradise, with the location
shown on every card.
