# Plan SEO — Mr Moustache Barbershop Broadbeach

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

## 3. Pendiente: datos que necesito para cerrar el on-page

| Dato | Dónde va | Por qué |
| --- | --- | --- |
| **Dominio definitivo** (`mrmoustachebroadbeach.com.au`, `mrmoustache.com.au/broadbeach`…) | `NEXT_PUBLIC_SITE_URL` en Vercel | Canonical, sitemap, robots y schema dependen de él. **Bloqueante para lanzar.** |
| **Horario de cierre** de cada día | `openingHours` en `src/data/business.ts` | Se muestra en la web y activa `openingHoursSpecification`. |
| **Coordenadas** del pin del GBP (5+ decimales) | `geo` en `src/data/business.ts` | Schema `GeoCoordinates`. |
| **URL del GBP de Broadbeach** (link "Compartir" de Maps) | `NEXT_PUBLIC_GOOGLE_PROFILE_URL` | Botón Google + `sameAs`. |
| **Instagram** real | `NEXT_PUBLIC_INSTAGRAM_URL` | Botón + `sameAs`. Agregar Facebook si hay. |
| **Link de reservas de Square** de Broadbeach | `NEXT_PUBLIC_SQUARE_BOOKING_URL` | Todos los CTA + `ReserveAction`. |
| **Confirmar teléfono** `0421 574 445` como definitivo de Broadbeach | `src/data/business.ts` | NAP. |
| **Nombres de servicios** tal cual en Square | `src/data/services.ts` | Hoy: Standard Haircut, Zero Fade, Skin Fade, Beard Trim & Line Up, Haircut & Beard. Si en Square son "Classic Cut", "Taper"… los igualamos. |

## 4. Siguiente fase técnica (propuesta, sin tocar diseño)

1. **Vídeo "Our Work":** recomprimir (objetivo ≤ 2 MB, 720p, sin audio si no
   hace falta), cargarlo solo cuando entra en pantalla y pasar
   `preload="auto"` → `"none"`/`"metadata"`. Es el mayor ahorro de
   rendimiento de la página.
2. **Nombres de imagen con contenido real:** `hero.webp` →
   `mr-moustache-broadbeach-skin-fade.webp`, etc. Ayuda poco, pero no cuesta
   nada. Los fondos decorativos siguen con `alt=""`. Solo las fotos que
   muestran trabajo real llevan alt descriptivo ("Skin fade at Mr Moustache
   Broadbeach").
3. **Sección "Meet Our Broadbeach Barbers"** (H2) cuando haya fotos y nombres
   (p. ej. Aitor, que ya aparece en las reviews). Aporta texto real y
   confianza.
4. **Lighthouse / PageSpeed** en producción: LCP del hero, CLS y peso total.
5. Validar con **Rich Results Test** y **Schema Markup Validator** con el
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
- [ ] Dominio + `NEXT_PUBLIC_SITE_URL`
- [ ] Horario de cierre, geo, URLs reales (GBP, IG, Square)
- [ ] Vídeo optimizado
- [ ] Redirects de dominio
- [ ] GBP enlazado y completo
- [ ] Search Console + sitemap + indexación
- [ ] Rich Results Test en producción
