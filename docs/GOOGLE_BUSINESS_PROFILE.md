# Google Business Profile ↔ web

Cómo conectar cada ficha de Google (GBP) con su página de la web y medir qué
genera cada una. Se hace **una vez que el dominio definitivo esté publicado**
(`NEXT_PUBLIC_SITE_URL` en Vercel). En los ejemplos, `<dominio>` es ese dominio.

## 1. Una página por sede

Cada ficha enlaza a **su** página, no a la home. Así Google ve una página que
habla solo de esa barbería (mismo nombre, dirección, teléfono, horarios y
servicios que la ficha) y la puede asociar a ese negocio.

| Ficha de Google | Página | H1 | Title |
| --- | --- | --- | --- |
| Surfers Paradise | `/surfers-paradise` | Barber in Surfers Paradise | Barber in Surfers Paradise – Fades & Beard Trims \| Mr Moustache |
| Broadbeach | `/broadbeach` | Barber in Broadbeach | Barber in Broadbeach – Fades & Beard Trims \| Mr Moustache |

La home (`/`) queda como página de marca para "barber Gold Coast" y búsquedas
por nombre, y enlaza a las dos sedes desde el menú, el hero y el footer.

## 2. Qué cargar en cada ficha

### Sitio web (con UTM)

Los parámetros UTM permiten ver en Analytics cuántas visitas manda cada ficha y
qué hacen después (reservar, llamar, pedir indicaciones). La página tiene
`canonical` sin parámetros, así que Google sigue indexando la URL limpia.

| Ficha | Campo "Sitio web" |
| --- | --- |
| Surfers Paradise | `https://<dominio>/surfers-paradise?utm_source=google&utm_medium=organic&utm_campaign=gbp-surfers-paradise` |
| Broadbeach | `https://<dominio>/broadbeach?utm_source=google&utm_medium=organic&utm_campaign=gbp-broadbeach` |

Las genera `gbpWebsiteUrl()` en `src/lib/seo.ts` (con test en
`tests/seo.test.ts`).

### Link de reservas ("Citas" / "Appointment")

| Ficha | Link |
| --- | --- |
| Surfers Paradise | `https://book.squareup.com/appointments/o0xkg1fz5zxow7/location/LA3KEKYDA4KV3` |
| Broadbeach | `https://book.squareup.com/appointments/o0xkg1fz5zxow7/location/LS4XGMYEDQ5ER` |

Si Square aparece como partner de reservas de Google ("Reserve with Google"),
activarlo desde Square también suma el botón "Reservar" en la ficha.

### NAP idéntico (nombre, dirección, teléfono)

Tiene que coincidir carácter a carácter entre la ficha, la web (`src/data/locations.ts`),
Square, Instagram/Facebook y directorios (Apple Business Connect, Bing Places,
Yelp AU, True Local, Hotfrog).

| | Surfers Paradise | Broadbeach |
| --- | --- | --- |
| Nombre | Mr Moustache Barbershop Surfers Paradise | Mr Moustache Barbershop Broadbeach |
| Dirección | 3 Orchid Ave, Surfers Paradise QLD 4217 | Unit 5/2623 Gold Coast Hwy, Broadbeach QLD 4218 |
| Teléfono | 0421 574 445 ⚠️ (hoy es el mismo en las dos) | 0421 574 445 |

⚠️ La ficha de Surfers Paradise figura como **"Mr. Moustache"** (con punto) y la
web usa "Mr Moustache". Conviene unificar la marca en las dos fichas (el schema
ya declara las dos formas como `alternateName`). No agregar keywords al nombre
("Mr Moustache Barber Fades…"): Google lo penaliza.

⚠️ Si cada sede tiene su propio número, cargarlo en `src/data/locations.ts`: un
teléfono por sede ayuda a que Google no las mezcle.

### Resto de la ficha (las dos)

- [ ] Categoría principal: **Barber shop**.
- [ ] Horarios iguales a la web (hoy salen de la disponibilidad de Square; el
      cliente tiene que confirmarlos) y horarios especiales en feriados.
- [ ] Servicios con los mismos nombres y precios que la web y Square
      (Standard Haircut A$45, Zero Fade A$50, Skin Fade A$55, …).
- [ ] Descripción en lenguaje natural que mencione la zona, los servicios
      (skin fades, taper fades, beard trims) y **"Spanish-speaking barbers /
      hablamos español"**.
- [ ] Atributos disponibles que apliquen (idiomas, medios de pago, accesibilidad).
- [ ] Fotos reales de cada sede: fachada (para que la encuentren al llegar),
      interior, equipo y cortes. Subir fotos nuevas seguido.
- [ ] Publicaciones (novedades, promos) cada una o dos semanas.
- [ ] Pedir reseñas después de cada corte (la automatización de Square ya manda
      el link de "escribir reseña" de cada sede; ver `docs/AUTOMATION.md`) y
      responderlas todas, mencionando el servicio de forma natural.

## 3. Medir la performance

### En la ficha (Google Business Profile → Rendimiento)

Por sede y por mes: búsquedas que mostraron la ficha (y con qué términos),
vistas en Maps y en Búsqueda, **llamadas**, **solicitudes de indicaciones**,
**clics al sitio web** y reservas. Exportarlo una vez por mes para comparar.

### En la web (Google Analytics 4)

La web ya etiqueta cada acción importante y las manda a GA4 en cuanto se
configura el ID (sin ID no se carga nada, así que no afecta el rendimiento):

1. Crear una propiedad GA4 y copiar el ID de medición (`G-XXXXXXXXXX`).
2. En Vercel → Settings → Environment Variables (Production):
   `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` y volver a desplegar.
3. En GA4 → Administrar → Definiciones personalizadas: crear la dimensión
   **`shop`** (ámbito: evento).
4. En GA4 → Eventos: marcar **`booking_click`** como evento clave (conversión);
   opcionalmente también `phone_click` y `directions_click`.

| Evento | Cuándo | `shop` |
| --- | --- | --- |
| `booking_click` | Cualquier botón de reserva o fila de servicio (abre Square) | `surfers-paradise` / `broadbeach` cuando el botón es de una sede |
| `directions_click` | "Get Directions" | la sede |
| `phone_click` | Tocar el teléfono | la sede (en el footer, sin sede) |
| `google_click` | Tarjetas de rating / "See … on Google Maps" | la sede |
| `instagram_click` | Links a Instagram | — |

Reporte clave: **Adquisición → Adquisición de tráfico**, filtrado por
campaña de sesión `gbp-surfers-paradise` / `gbp-broadbeach`, con los eventos
clave como columnas. Eso responde "¿cuántas reservas trae cada ficha?".

La carga de gtag.js es diferida (`lazyOnload`, después de que la página cargó),
así que no toca los puntajes de Lighthouse. Si se prefiere algo sin cookies,
Vercel Web Analytics también lee los UTM, pero los eventos personalizados
requieren el plan Pro.

### En Search Console

1. Verificar el dominio (registro DNS). Si no hay acceso al DNS, usar la
   verificación por etiqueta HTML: poner el código en
   `GOOGLE_SITE_VERIFICATION` (Vercel) y desplegar.
2. Enviar `https://<dominio>/sitemap.xml` (incluye la home, las dos sedes y
   sus fotos).
3. Inspeccionar `/`, `/surfers-paradise` y `/broadbeach` → "Solicitar
   indexación".
4. A las 3–6 semanas: Rendimiento → filtrar por página para ver con qué
   búsquedas aparece cada sede (`barber broadbeach`, `skin fade surfers
   paradise`, `spanish speaking barber gold coast`, …) y ajustar textos.

### Más adelante (opcional)

La **Business Profile Performance API** permite traer esas métricas de las
fichas a un tablero propio junto con GA4. Requiere pedir acceso a Google
(Google Cloud + OAuth del dueño de las fichas); tiene sentido cuando haya
algunos meses de datos.
