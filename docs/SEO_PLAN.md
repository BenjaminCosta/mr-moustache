# Plan SEO — Mr Moustache Barbershop

> **Estado actual (septiembre 2026):** la web es la landing de la marca (`/`)
> más **una página por sede**: `/surfers-paradise` y `/broadbeach`, cada una
> con su title, H1, NAP, horarios, precios, reviews, FAQ y `HairSalon` en
> JSON-LD. Cada Google Business Profile enlaza a su página
> (`docs/GOOGLE_BUSINESS_PROFILE.md`). Lo último está en la sección 9
> ("Cuarta pasada"); las secciones 1–8 quedan como historial de cuando la
> web era solo de Broadbeach.

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

## 9. Cuarta pasada: páginas por sede, GBP y performance (septiembre 2026)

### Estructura para posicionar las dos sedes

Google posiciona fichas y páginas **por sede**. Una sola landing con las dos
direcciones en pestañas (una de ellas oculta) no alcanza para competir por
"barber broadbeach" y "barber surfers paradise" a la vez. Ahora:

| URL | Para qué búsquedas | H1 | Title |
| --- | --- | --- | --- |
| `/` | barber / barbershop Gold Coast, Spanish-speaking barber Gold Coast, marca | Mr Moustache Barbershop · Gold Coast | Gold Coast Barbers in Surfers Paradise & Broadbeach \| Mr Moustache |
| `/surfers-paradise` | barber / barbershop Surfers Paradise, fades / skin fade Surfers Paradise, Spanish-speaking barber Surfers Paradise | Barber in Surfers Paradise | Barber in Surfers Paradise – Fades & Beard Trims \| Mr Moustache |
| `/broadbeach` | barber / barbershop Broadbeach, fades / skin fade Broadbeach, Spanish-speaking barber Broadbeach | Barber in Broadbeach | Barber in Broadbeach – Fades & Beard Trims \| Mr Moustache |

Cada página de sede (`src/components/pages/LocationPage.tsx`, textos en
`page` de `src/data/locations.ts`):

- **Hero:** breadcrumb (Home / Broadbeach), H1, intro propia, "Book at
  Broadbeach" (Square de esa sede), "Get Directions", rating de Google de esa
  sede y "Spanish-speaking barbers · Hablamos español".
- **Precios** (H2 "Broadbeach barber prices"): cada fila abre ese servicio en
  el Square de esa sede. Sin JavaScript (se renderiza en el servidor).
- **Reviews** (H2 "Broadbeach Google reviews"): solo las de esa sede.
- **Find us in Broadbeach** (H2): dirección, horarios de toda la semana
  abiertos por defecto, teléfono, botones y link a la ficha en Maps. Menciona
  los barrios cercanos (Mermaid Beach, Broadbeach Waters…).
- **FAQ** (H2 "Broadbeach barber FAQ", preguntas en H3): español, precios,
  horarios, cómo reservar, dónde queda, cortes para chicos. Las respuestas se
  arman con los datos (precios, horarios, dirección), así nunca quedan
  desactualizadas respecto al resto de la página.
- **Also on the Gold Coast:** link a la otra sede.

Enlazado interno: el menú, la lista "Our locations" del hero, el footer y
cada pestaña de "Find us" de la home ("More about Mr Moustache Broadbeach")
llevan a las páginas de sede. Los links viejos `/#surfers-paradise` y
`/#broadbeach` siguen abriendo la pestaña correcta.

### Técnico

- **Canonical y Open Graph por página** (`pageMetadata()` en
  `src/lib/seo.ts`). Antes el `canonical: "/"` estaba en el layout y lo
  heredaba cualquier página nueva (incluida la 404).
- **JSON-LD** (`src/lib/structured-data.ts`):
  - Home: `Organization` + `WebSite` (nombre del sitio en Google, con
    `alternateName` "Mr Moustache" y "Mr. Moustache Barbershop") + `WebPage` +
    los dos `HairSalon`.
  - Cada sede: su `HairSalon` completo (`url` = su página, fotos, horarios,
    `areaServed` con barrios cercanos, `knowsLanguage` en/es, `ReserveAction`
    a su Square, catálogo de servicios con precio y link de reserva por
    servicio) + `BreadcrumbList` + `FAQPage` + `WebPage`.
  - Mismo `@id` por sede en todas las páginas (`/broadbeach#barbershop`).
  - Sigue sin `aggregateRating`: Google no muestra estrellas de reviews
    servidas por el propio negocio en `LocalBusiness`.
- **Sitemap:** home + dos sedes, con sitemap de imágenes (fotos reales).
- **robots.txt:** `Disallow: /api/` en producción; todo bloqueado en previews.
- **`max-image-preview: large`** en robots meta (fotos grandes en resultados).
- **`/work-with-us` redirige con 308** (permanente) a `/#work-with-us`; antes
  era 307 (temporal).
- **Search Console por etiqueta HTML** opcional: `GOOGLE_SITE_VERIFICATION`.
- **Alt texts:** fotos de cada sede con alt descriptivo y nombre de archivo
  descriptivo (`mr-moustache-barber-clipper-cut.webp`,
  `mr-moustache-barber-haircut-mirror.webp`); fondos decorativos con `alt=""`.
  ⚠️ Son fotos reales del equipo, pero no sabemos de qué sede es cada una:
  reemplazarlas por una foto confirmada de cada local cuando las haya
  (`image` en `src/data/locations.ts`).

### Performance

| Lighthouse móvil (simulado, 3–5 corridas, build local) | `main` antes | Ahora |
| --- | --- | --- |
| Home | 77–95 | **91–98** |
| `/surfers-paradise` | — | **93–98** |
| `/broadbeach` | — | **94–98** |
| Escritorio (las tres) | 100 | **100** |
| Buenas prácticas | 96 | **100** |
| SEO / Accesibilidad | 100 / 100 | 100 / 100 |
| Peso de la carga inicial (home) | 454 KB | **371 KB** |

(El 77 de `main` fue la primera corrida con la caché de imágenes fría. En la
home el LCP simulado sale 2,5 s o 3,1 s según si una tarea de JS de ~40 ms
arranca antes o después del primer pintado; los requests son los mismos.
Medido contra `next start` local, que sirve HTTP/1.1; Vercel sirve HTTP/2 y
desde CDN, así que PageSpeed Insights en producción debería dar igual o mejor.)

Qué cambió:

- **Fuentes de abajo del pliegue, diferidas:** Roboto (tarjetas de reviews,
  37 KB) y Comforter Brush (frases manuscritas, 45 KB) se descargaban en la
  primera carga aunque estuvieran al final de la página. Ahora la clase de la
  fuente se aplica cuando el texto se acerca a la pantalla
  (`useNearViewport` + `ScriptText`). Se ven igual.
- **Fondos oscurecidos a calidad 50** (servicios, reviews, Work With Us,
  footer, palmeras): están bajo overlays negros de 50–95 %, no se nota.
- **Íconos de máscara** (bigote, palmera) de PNG a WebP sin pérdida.
- **favicon.ico** de 16 a 9 KB y **icon.png** de 93 a 19 KB (sin cambio visible).
- **Texto legible en móvil:** las reviews (10 px → 13 px, tarjetas más anchas)
  y las descripciones de servicios (10,7 px → 12 px). Lighthouse marcaba
  "Document doesn't use legible font sizes" (46 % de texto legible).
- **Probado y descartado:** `content-visibility: auto` en las secciones de
  abajo. Mejoraba un poco, pero corría los anclajes (`/#work-with-us`
  quedaba ~100 px desplazado).

Lo que queda es el runtime de React/Next (~150 KB de JS) y el CSS (15 KB),
comunes a cualquier sitio Next.

### Keywords

Las que pidió trabajar el cliente (barber, barbershop, fades, Spanish-speaking
barber, Gold Coast, Broadbeach, Surfers Paradise) están repartidas por página
según la tabla de arriba, en title, H1, H2, intro, FAQ y schema, sin repetir de
más. **Pendiente de Aitor:** confirmar si hay otras que quiera priorizar
(p. ej. "mullet", "burst fade", "kids haircut") para sumarlas al copy.

Idea para después: una versión en español (`/es/…`) para "barbero Gold
Coast" / "barbería en Surfers Paradise", con `hreflang`. Hay mucha comunidad
latina y española en la Gold Coast y casi no hay competencia en español.

### Pendiente del cliente (bloquea parte del SEO local)

| Dato | Dónde va |
| --- | --- |
| Dominio definitivo | `NEXT_PUBLIC_SITE_URL` en Vercel (canonical, sitemap, schema) |
| Horarios oficiales de cada sede (hoy salen de la disponibilidad de Square) | `openingHours` en `src/data/locations.ts` |
| Teléfono propio de cada sede, si existe | `phone` en `src/data/locations.ts` |
| Coordenadas del pin de cada ficha | `geo` en `src/data/locations.ts` |
| Foto confirmada de cada local | `image` en `src/data/locations.ts` |
| Keywords extra de Aitor | copy de las páginas |

---

### Checklist rápido

- [x] Title, meta description, OG por página
- [x] H1/H2 con el tema real (home y cada sede)
- [x] Una página por sede, enlazada desde menú, hero, footer y "Find us"
- [x] Schema `HairSalon` por sede + `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`
- [x] Sitemap (con imágenes) / robots / canonical por página / noindex en previews
- [x] Vídeo optimizado y con carga diferida
- [x] Imágenes con nombres descriptivos + AVIF + alt
- [x] Fuentes de abajo del pliegue diferidas; Lighthouse móvil 91–98, escritorio 100
- [x] Links de reservas por sede (Square)
- [x] Medición preparada (GA4 por variable de entorno + UTM por ficha)
- [ ] Horarios y teléfono confirmados por el cliente
- [ ] Dominio + `NEXT_PUBLIC_SITE_URL`
- [ ] Geo de cada ficha
- [ ] Redirects de dominio
- [ ] GBP enlazados a su página (ver `docs/GOOGLE_BUSINESS_PROFILE.md`)
- [ ] GA4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) + evento clave `booking_click`
- [ ] Search Console + sitemap + indexación de las tres URLs
- [ ] Rich Results Test en producción
