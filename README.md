# Mr Moustache Broadbeach landing

Technical foundation for the dedicated Mr Moustache Barbershop Broadbeach landing page.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Before launch

1. Copy `.env.example` to `.env.local` and replace every placeholder URL.
2. Replace placeholder services, barbers, reviews and opening hours in `src/data`.
3. Replace placeholder images in `public/images` and update their alt text.
4. Replace the neutral design tokens in `src/app/globals.css` after brand approval.
5. Confirm the metadata and LocalBusiness JSON-LD fields in `src/app/layout.tsx`.

All booking calls to action read from the single `SQUARE_BOOKING_URL` source in
`src/lib/constants.ts` (or its matching environment variable).

## Approved design foundation

- Display type: Cherry Swash for H1, H2 and selected service names.
- Body/UI type: Instrument Sans.
- Palette: black `#000000`, dark grey `#1E1E1E`, cold white `#EFF4F5`,
  cyan `#1FA7B3` and dark teal `#006C80`.
- Direction: classic barber with modern execution; dark, editorial and clean.
- Small corner radius, thin lines, simple cards and large real photography.

## Page structure

1. Hero
2. Services + Prices
3. Our Work + Barbers
4. Reputation / Brand Story
5. Location + Hours
6. Footer
