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
2. Confirm services, prices, phone and opening hours in `src/data`.
3. Add the background photography and the "Our Work" clip: drop the files in
   `public/images/backgrounds` and set their paths in `src/data/media.ts`
   (every slot falls back to a dark gradient while it is `null`).
4. Confirm the metadata and LocalBusiness JSON-LD fields in `src/app/layout.tsx`.

All booking calls to action read from the single `SQUARE_BOOKING_URL` source in
`src/lib/constants.ts` (or its matching environment variable).

## Approved design foundation

- Display type: Cherry Swash for H1, H2 and selected service names.
- Body/UI type: Instrument Sans.
- Accent script: Comforter Brush, only for the hand-lettered "Broadbeach" and
  "Good Hair Better People" taglines.
- Palette: black `#000000`, dark grey `#1E1E1E`, cold white `#EFF4F5`,
  cyan `#10C0D9` and dark teal `#006C80`.
- Direction: classic barber with modern execution; dark, editorial and clean.
- Small corner radius, thin lines, simple cards and large real photography.

## Page structure

Built mobile-first from the mockups in `mr-moustache-material/` (drawn at a
390px viewport; below that width the root font size scales so every section
keeps its proportions).

1. Hero (`src/components/sections/Hero.tsx`)
2. Services + Prices (`src/components/sections/Services.tsx`)
3. Our Work (`src/components/sections/OurWork.tsx`)
4. Find Us / Location (`src/components/sections/Location.tsx`)
5. Footer (`src/components/layout/Footer.tsx`)
