# Mr Moustache Barbershop

Brand landing for Mr Moustache Barbershop and its two Gold Coast shops,
Surfers Paradise and Broadbeach, with a careers section at the end of the
landing page.

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
5. Square booking automation (review requests and rebooking reminders) is
   documented in `docs/AUTOMATION.md`.

Booking calls to action read from `src/lib/constants.ts`:
`SQUARE_BOOKING_URL` for the general "Book Now" buttons and
`SQUARE_BOOKING_URL_SURFERS_PARADISE` / `SQUARE_BOOKING_URL_BROADBEACH` for each
shop's buttons (the "Book Now" in each Find Us tab), which open that shop's own
Square Appointments page.

## Work With Us form

The careers form sends each application from the browser to
[Web3Forms](https://web3forms.com) (`POST https://api.web3forms.com/submit`,
`src/app/work-with-us/WorkWithUsForm.tsx`), which emails it to the inbox tied to
the access key. The visitor stays on the page and sees "Application sent"; the
browser checks the required fields.

- **Setup:** create an access key at web3forms.com with the inbox that should
  receive applications (e.g. the client's `aitgv0@gmail.com`) and set it as
  `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in Vercel. The key is public by design;
  Web3Forms' free plan only accepts submissions from browsers.
- Reply-to is the applicant's email (the `email` field).
- FormSubmit was dropped: it answered this site with HTTP 500 for every new form
  (and Cloudflare blocks it from servers), including santosbecker.com's.

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
6. Work With Us (`src/components/sections/WorkWithUs.tsx`)
7. Footer (`src/components/layout/Footer.tsx`)

### Google reviews

Ratings and review counts for both locations live in `src/data/reviews.ts`
(`googleRatings`). The `reviews` array contains short excerpts from verified
public Google reviews for Broadbeach and Surfers Paradise, with the location
shown on every card.
