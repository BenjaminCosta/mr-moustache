# Plan SEO — Mr Moustache Barbershop Broadbeach

> **Actualización (septiembre 2026):** el cliente pasó la web de landing solo
> de Broadbeach a landing de la marca con sus dos barberías. Title, meta
> description y JSON-LD ahora cubren Mr Moustache Barbershop, con un
> `HairSalon` para Surfers Paradise y otro para Broadbeach
> (`src/lib/structured-data.ts`). Las notas específicas de Broadbeach que
> siguen quedan como historial.

Objetivo: que Google entienda sin dudas que esta landing es **la web oficial de
una barbería física en Broadbeach**, qué servicios ofrece y que es el mismo
negocio que el Google Business Profile (GBP) de Broadbeach.

Google ordena los resultados locales por **relevancia, distancia y
prominencia**. La distancia no depende de nosotros; la relevancia (web + GBP
claros y coherentes) y la prominencia (reviews, fotos, menciones) sí.

## Keywords

| Prioridad  | Búsquedas                                                                 |
| ---------- | ------------------------------------------------------------------------- |
| Principal  | barber Broadbeach · barbershop Broadbeach                                 |
| Secundaria | skin fade / haircut / men's haircut / beard trim Broadbeach · barber Gold Coast |

Aparecen de forma natural en title, H1/H2, copy de servicios y dirección. Nada
de repetir "barber Broadbeach" quince veces ni de rellenar alts con keywords.

---

## 1. Auditoría del estado actual (antes de esta rama)

| Área | Estado | Problema |
| --- | --- | --- |
| Title | `Mr Moustache Barbershop Broadbeach` | Correcto pero sin "Barber Broadbeach" delante. |
| Meta description | Genérica ("Book … through Square") | No menciona servicios ni dirección. |
| `keywords` meta | Presente | Google la ignora; ruido. |
| H1 | "Good cuts. Good people. Proper barbering." | No dice qué es ni dónde. |
| H2 | "Tried. True. Tailored." / "Fresh cuts, done properly." / "Trusted on the Gold Coast." / "Right in the Heart of Broadbeach" | Creativos; los temas reales ("Services", "Find us") estaban en `<p>`. |
| Schema | `@type: "BarberShop"` | **No existe en schema.org** → tipo inválido. Sin `url`, `geo`, `priceRange`, horario de cierre ni servicios. `openingHoursSpecification` sin `closes`. |
| Canonical / sitemap / robots | Existen | Si falta `NEXT_PUBLIC_SITE_URL`, todo apunta a `https://example.com`. Previews de Vercel indexables. |
| NAP | `5/2623 Gold Coast Hwy` | Debe coincidir carácter a carácter con el GBP. |
| Horarios | "Open from 10:00 am, 7 days" | Falta la hora de cierre (web y schema). |
| Links | Square, Instagram, GBP | Siguen siendo placeholders. |
| Imágenes | WebP, `next/image`, hero con `preload`, fondos decorativos con `alt=""` | Bien. |
| Vídeo "Our Work" | MP4 de **7,1 MB**, `autoplay` + `preload="auto"` | Lo más pesado de la página; castiga el rendimiento en móvil. |

## 2. Hecho en esta rama (on-page + técnico)

- **Title:** `Barber Broadbeach | Mr Moustache Barbershop`.
- **Meta description** (OG y Twitter incluidos):
  "Mr Moustache Barbershop Broadbeach. Classic cuts, skin fades, tapers and
  beard trims at Unit 5/2623 Gold Coast Hwy. View prices and book online."
  Se genera desde `src/data/business.ts`, así que el NAP tiene una sola fuente.
- Eliminado el meta `keywords`.
- **Esquema de headings** (el diseño no cambia; solo cambia qué elemento es
  heading):
  - H1: **Mr Moustache Barbershop Broadbeach** (la línea pequeña sobre el
    titular). "Good cuts. Good people. Proper barbering." sigue siendo el
    titular visual, ahora como `<p>`.
  - H2: **Barber services & prices** · **Our work** · **Google reviews** ·
    **Find us in Broadbeach** (las etiquetas de sección). Las frases
    creativas se quedan igual visualmente.
- **Copy local:**
  - Hero: ya decía "Classic cuts, skin fades, tapers and beard trims — right in
    the heart of Broadbeach."
  - Services: "Book your next cut at Mr Moustache Broadbeach."
  - Location: "Looking for a barber in Broadbeach? Find Mr Moustache on the
    Gold Coast Hwy."
  - Reviews: ya cuenta el vínculo con Surfers Paradise.
- **Dirección:** `Unit 5/2623 Gold Coast Hwy, Broadbeach QLD 4218` (web, meta y
  schema). ⚠️ Confirmar que el GBP usa exactamente este formato.
- **Schema** (`src/lib/structured-data.ts`):
  - `HairSalon` (el `LocalBusiness` más específico que existe).
  - `@id`, `url`, `image`, `logo`, `telephone`, `address`, `priceRange: $$`,
    `hasMap`, `areaServed`, `parentOrganization`.
  - Catálogo de servicios con precios en AUD.
  - `geo`, horarios, `sameAs` y `ReserveAction` solo se publican cuando el dato
    real está cargado, nunca con placeholders.
  - **Sin `aggregateRating` a propósito:** Google no muestra reviews servidas
    por el propio negocio para `LocalBusiness`. Las reviews se trabajan en el
    GBP.
- **Indexación:** `robots.txt` y `<meta name="robots">` quedan en `noindex` /
  `Disallow` automáticamente en previews de Vercel (`VERCEL_ENV !==
  "production"`). Producción queda `index, follow`.

## 3. Hecho en la segunda pasada (rendimiento, imágenes y links)

- **Vídeo "Our Work":** recomprimido de 1080p a 720p (H.264 CRF 27, AAC 96k,
  faststart). Pasa de **7,1 MB a 1,6 MB** sin diferencia visible. Además solo
  se descarga cuando la tarjeta se acerca a la pantalla (`IntersectionObserver`
  + `preload="none"`). También tiene un `aria-label` que describe el clip.
- **Imágenes con nombres descriptivos:**
  `mr-moustache-broadbeach-barber-haircut.webp`,
  `barber-scissors-clippers-comb.webp`, `broadbeach-gold-coast-aerial.webp`,
  `gold-coast-beach-night.webp`, `palm-tree-silhouettes.webp`,
  `barber-scissors-towel.webp`, `mr-moustache-fade-haircut-poster.jpg`,
  `mr-moustache-fade-haircut.mp4`. Se borró el `our-work-poster.webp`, que no
  se usaba. Los fondos decorativos siguen con `alt=""`.
- **AVIF:** `next.config.ts` sirve AVIF (y WebP como alternativa) desde
  `next/image`.
- **Fuentes:** Comforter Brush (131 KB) y Roboto (37 KB) ya no se precargan.
  Solo aparecen debajo del primer pantallazo y competían con la imagen del
  hero.
- **Accesibilidad:** las filas de servicios y las tarjetas de rating de Google
  ahora tienen un nombre accesible que coincide con el texto visible (fallaba
  `label-content-name-mismatch`).
- **Links:**
  - Reservas → `https://mr-moustache-barbershop.square.site/`, el Square
    Online de Mr Moustache. Con esto el schema publica `ReserveAction`.
  - Instagram → `https://www.instagram.com/mr.moustache.barbers/`, el handle
    que figura en los clips descargados de `mr-moustache-material/`.
    ⚠️ Confirmar que es la cuenta oficial.
  - El link a Google Maps ahora busca por nombre + dirección
    ("Mr Moustache Barbershop Broadbeach, Unit 5/2623 Gold Coast Hwy…"), así
    abre la ficha y no un pin suelto.

**Lighthouse (móvil simulado, build local, 3 corridas cada una):**

| | `main` | esta rama |
| --- | --- | --- |
| Peso de la carga inicial | ~3,7 MB | **557 KB** |
| Performance | 88–92 | 85–92 (dentro del ruido) |
| SEO / Accesibilidad / Buenas prácticas | 100 / 100 / 100 | 100 / 100 / 100 |
| Escritorio | — | Performance 99, LCP 0,8 s |

El puntaje de performance móvil sale igual (varía de una corrida a otra). La
ganancia real es el peso: un 85 % menos de datos móviles en la primera visita.

### Tercera pasada: performance

- **Comforter Brush autoalojada y recortada:** la fuente completa (133 KB) se
  descargaba igual en la primera carga, porque el navegador la pide en cuanto
  hay texto que la usa en el DOM. Ahora es un subset con solo los glifos de
  "Broadbeach" y "Good Hair Better People" (**35 KB**, se ve idéntico). El
  README de `src/app/fonts/` explica cómo regenerarla si cambian esos textos.
- **Póster del vídeo:** pasó de JPG 1080p (26 KB) a WebP 720p (**5 KB**) y se
  carga junto con el vídeo, cuando la tarjeta se acerca a la pantalla.
- **Hero:** `preload` + `fetchPriority="high"`. Antes el preload a veces salía
  con prioridad baja.
- **Logo del header:** `loading="eager"` en vez de `preload`, para que no
  compita con la imagen del hero.
- **Carrusel de reviews:** se quitó una medición síncrona al montar, que
  forzaba un reflow de ~50 ms durante la hidratación.
- **Caché:** `public/images` y `public/videos` se sirven con
  `Cache-Control: public, max-age=604800, stale-while-revalidate=86400`.
- **Probado y descartado:** `experimental.inlineCss`. Next duplica el CSS en el
  payload RSC (el HTML pasa de 182 KB a 407 KB) y en las mediciones rindió
  peor (80–94 contra 90–97).

| Lighthouse (4 corridas) | Antes de esta pasada | Después |
| --- | --- | --- |
| Peso de la carga inicial | 557 KB | **435 KB** |
| Performance móvil (simulado) | 85–92 | **89–96** |
| TBT móvil | 50–140 ms | 60–70 ms |
| Escritorio | 99 | **100** (LCP 0,7 s) |
| SEO / Accesibilidad / Buenas prácticas | 100 | 100 |

El LCP móvil que calcula Lighthouse (2,6–3,7 s) es una simulación de 4G
lenta. El LCP real observado en local es de ~0,2 s. Lo que queda es el
runtime de React/Next (~140 KB de JS), que es la base de cualquier sitio Next.

## 4. Pendiente

### Datos del Square (no accesibles desde este entorno)

La política de red del entorno bloquea `mr-moustache-barbershop.square.site`
(y la búsqueda web lo confunde con un "Mr Moustache" de Orlando, EE. UU.).
Hace falta, desde Square:

| Dato | Dónde va |
| --- | --- |
| **Horario de apertura y cierre de cada día** (Broadbeach) | `openingHours` + `hours` en `src/data/business.ts`. Activa `openingHoursSpecification` en el schema. |
| **Servicios de Broadbeach**: nombre, descripción, precio y duración exactos | `src/data/services.ts` |
| **Teléfono** de Broadbeach | `phone` en `src/data/business.ts` |
| **Link directo a la reserva de Broadbeach** (si el Square Online tiene selector de sede) | `NEXT_PUBLIC_SQUARE_BOOKING_URL` |
| Facebook / otras redes, si figuran | `links` + `sameAs` |

Para que pueda leerlo directamente hay que habilitar el dominio
`mr-moustache-barbershop.square.site` (o un nivel de acceso a red más amplio)
en la configuración del entorno cloud. La otra opción es pegar el contenido
en el chat.

### Otros

| Dato | Dónde va |
| --- | --- |
| **Dominio definitivo** (pendiente por decisión) | `NEXT_PUBLIC_SITE_URL` en Vercel. Bloqueante para lanzar. |
| **Coordenadas** del pin del GBP (5+ decimales) | `geo` en `src/data/business.ts` |
| **URL del GBP de Broadbeach** (link "Compartir" de Maps) | `NEXT_PUBLIC_GOOGLE_PROFILE_URL` |
| Confirmar la dirección exacta del GBP ("Unit 5/2623 …") | `src/data/business.ts` |

### Mejoras opcionales

1. Sección **"Meet Our Broadbeach Barbers"** (H2) cuando haya fotos y nombres
   (p. ej. Aitor, que ya aparece en las reviews).
2. Validar con **Rich Results Test** y **Schema Markup Validator** con el
   dominio real.

## 5. Hosting / dominio (fuera del código)

- En Vercel → Domains: definir el dominio principal y redirigir `www` ↔ apex
  con 308. Vercel ya fuerza `http → https`.
- Si la landing vive en un sitio central (`mrmoustache.com.au/broadbeach`), el
  canonical y el sitemap tienen que apuntar ahí. Lo ajustamos cuando esté
  decidido.
- Confirmar que producción responde `index, follow` después de publicar.

## 6. Google Business Profile ↔ landing

En el GBP de **Broadbeach** (no en el de Surfers Paradise):

- [ ] Website → URL canónica de esta landing
- [ ] Booking → Square Broadbeach
- [ ] Nombre: `Mr Moustache Barbershop Broadbeach` (sin keywords extra en el
      nombre, que Google lo penaliza)
- [ ] Categoría principal: **Barber shop**
- [ ] Servicios y precios iguales a la web y a Square
- [ ] Dirección y teléfono idénticos a la web
- [ ] Horarios (y horarios especiales en feriados)
- [ ] Fotos: fachada, interior, equipo y cortes
- [ ] Descripción del negocio con lenguaje natural

**NAP idéntico en todos lados:** landing, GBP, Square, Instagram/Facebook,
web de Surfers Paradise y directorios (Apple Maps / Business Connect, Bing
Places, Yelp AU, True Local, Hotfrog).

## 7. Indexación (el día del lanzamiento)

1. Search Console → verificar la propiedad de dominio (DNS).
2. Enviar `https://<dominio>/sitemap.xml`.
3. Inspeccionar URL → probar la URL publicada (render, canonical elegido por
   Google) → solicitar indexación.
4. Revisar la cobertura y las mejoras (datos estructurados) a los pocos días.

## 8. Después: medir y crecer

- A las 3–6 semanas, Search Console → Rendimiento: queries reales
  (`barber broadbeach`, `skin fade broadbeach`, `mr moustache broadbeach`…),
  impresiones, CTR y posición. Ajustamos title/copy con esos datos.
- **Reviews reales en el GBP de Broadbeach:** pedirlas con QR o link después
  del corte y responderlas todas.
- Seguir subiendo fotos al GBP y mantener los horarios al día.
- Que la web/Instagram de Surfers Paradise enlace a esta landing.
- Algunas menciones locales (asociaciones de Broadbeach, blogs y medios de la
  Gold Coast).
- **Sin blog.** No aporta nada para una sola landing local.

---

### Checklist rápido

- [x] Title, meta description, OG
- [x] H1/H2 con el tema real
- [x] Copy local natural
- [x] Schema `HairSalon` válido
- [x] Sitemap / robots / canonical / noindex en previews
- [x] Vídeo optimizado y con carga diferida
- [x] Imágenes con nombres descriptivos + AVIF
- [x] Links de reservas (Square) e Instagram
- [ ] Horarios, servicios y teléfono confirmados desde Square
- [ ] Dominio + `NEXT_PUBLIC_SITE_URL`
- [ ] Geo + URL del GBP
- [ ] Redirects de dominio
- [ ] GBP enlazado y completo
- [ ] Search Console + sitemap + indexación
- [ ] Rich Results Test en producción
