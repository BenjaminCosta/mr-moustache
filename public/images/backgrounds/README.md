# Background photography

Optimised WebP exports of the photos in `mr-moustache-material/`, wired up in
`src/data/media.ts`. File names describe the photo (they are what Google sees
for image search); decorative backgrounds keep an empty `alt`.

| File | Source | Used in |
| --- | --- | --- |
| `mr-moustache-barber-clipper-cut.webp` | `mr-moustache-barbershop.jpg` | Hero background (toned down 25%, top gradient behind the nav) |
| `barber-scissors-clippers-comb.webp` | `bg-services.png` | Services background (darkened in the middle) |
| `mr-moustache-fade-haircut-poster.webp` | first frame of the clip | "Our Work" video poster (720px, 5 KB) |
| `palm-tree-silhouettes.webp` | `bg-location-palms.png` | Find Us palms (grey silhouette with transparency) |
| `broadbeach-gold-coast-aerial.webp` | `location-broadbeach.png` | Find Us "Broadbeach" feature card |
| `barber-scissors-towel.webp` | `reviews-bg.png` | Reviews section background |
| `mr-moustache-barbers-team.webp` | `mr-moustache-barbershop-2.jpg` | Work With Us background (top band on mobile, right half on desktop) |
| `gold-coast-beach-night.webp` | `bg-footer.png` | Footer background |

The "Our Work" clip (`public/videos/mr-moustache-fade-haircut.mp4`) is a 720p
H.264 export (CRF 27, AAC 96k, faststart) of the original 1080p file, about
1.6 MB instead of 7.1 MB.

The share image (`src/app/opengraph-image.jpg` / `twitter-image.jpg`) is a
1200×630 crop of `mr-moustache-barbershop-3.jpg`, centred on the logo tee.
