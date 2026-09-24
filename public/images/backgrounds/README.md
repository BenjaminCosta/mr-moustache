# Background photography

Optimised WebP exports of the photos in `mr-moustache-material/`, wired up in
`src/data/media.ts`. File names describe the photo (they are what Google sees
for image search); decorative backgrounds keep an empty `alt`.

| File | Source | Used in |
| --- | --- | --- |
| `mr-moustache-broadbeach-barber-haircut.webp` | `bg-hero.png` | Hero background |
| `barber-scissors-clippers-comb.webp` | `bg-services.png` | Services background (darkened in the middle) |
| `mr-moustache-fade-haircut-poster.webp` | first frame of the clip | "Our Work" video poster (720px, 5 KB) |
| `palm-tree-silhouettes.webp` | `bg-location-palms.png` | Find Us palms (grey silhouette with transparency) |
| `broadbeach-gold-coast-aerial.webp` | `location-broadbeach.png` | Find Us "Broadbeach" feature card |
| `barber-scissors-towel.webp` | `reviews-bg.png` | Reviews section background |
| `gold-coast-beach-night.webp` | `bg-footer.png` | Footer background |

The "Our Work" clip (`public/videos/mr-moustache-fade-haircut.mp4`) is a 720p
H.264 export (CRF 27, AAC 96k, faststart) of the original 1080p file, about
1.6 MB instead of 7.1 MB.
