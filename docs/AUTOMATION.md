# Automatización de reservas (Square → Firestore → Resend)

Después de cada visita pagada por Square Appointments, la web:

1. **Pide una reseña de Google**: `REVIEW_DELAY_HOURS` después de que termina
   el turno (24 h por defecto).
2. **Manda un recordatorio para volver a reservar**: `REBOOKING_DELAY_DAYS`
   después de la visita (28 días por defecto), salvo que el cliente ya haya
   vuelto a reservar.

Los emails salen con el cron diario (alrededor de las 20:00 hora de Gold
Coast), en la primera corrida después de su hora: la reseña llega la noche
siguiente a la visita.

Todo corre en Vercel (`syd1`), guarda estado en Firestore (`australia-southeast1`)
y envía con Resend. Ningún envío sale mientras los flags
`REVIEW_AUTOMATION_ENABLED` / `REBOOKING_AUTOMATION_ENABLED` estén en `false`.

## Flujo

```
Square ──booking.created/updated──▶ /api/square/webhook ──▶ Firestore bookings/
                                                              │
Vercel Cron (20:00 AEST) ─▶ /api/cron/booking-automation ─────┤
   1. refresca tokens de Square (duran 30 días; se renuevan cada ~7)
   2. re-sincroniza reservas de -2 a +28 días (por si se perdió un webhook)
   3. procesa visitas terminadas: vuelve a leer la reserva y el cliente en
      Square, decide y deja cada email en la cola outbox/ con su hora
   4. envía los emails de outbox/ que ya vencieron, re-chequeando cada uno
```

Los emails **no se programan en Resend**: esperan en `outbox/` y justo antes de
enviarlos se vuelve a chequear todo. Por eso alcanza una API key de solo envío y
nunca hay que cancelar nada:

- **Cancelación o no-show** (`booking.updated` o el sync diario actualiza la
  reserva): el email se descarta al re-chequear.
- **El cliente volvió a reservar** (cualquier reserva aceptada que empieza
  después de esa visita): el recordatorio se descarta.
- **Baja**: cada email lleva un link firmado al pie. La baja bloquea los
  emails en cola y los futuros. También se respeta la preferencia
  `email_unsubscribed` de Square.
- **Si se apaga un flag**, los emails de ese tipo que estaban en cola se
  descartan.

Los emails están escritos como una nota personal (fondo blanco, link en lugar
de botón, firmados con `CUSTOMER_EMAIL_SIGNATURE`) y sin header
`List-Unsubscribe`, para que Gmail los deje en Principal y no en Promociones.

### Reglas de envío (`src/lib/automation/schedule.ts`)

| Regla | Efecto |
|---|---|
| Estado distinto de `ACCEPTED` (cancelada, no-show, rechazada) | no se envía nada |
| Visita procesada más de 7 días después de terminar | se saltea (evita mandar backlog viejo) |
| Local sin `SQUARE_LOCATION_ID_*` configurado | se saltea |
| Cliente sin email o dado de baja | se saltea |
| Reseña pedida en los últimos 180 días | no se vuelve a pedir |
| El cliente tiene otra reserva después de esa visita | no hay recordatorio de rebooking |

Las visitas procesadas con los flags apagados quedan marcadas como `skipped`
(`disabled`). Encender los flags después **no** manda emails retroactivos.

## Rutas

| Ruta | Protección | Uso |
|---|---|---|
| `GET /api/square/oauth/start?key=…` | `SQUARE_CONNECT_SECRET` (404 si no coincide) | conectar el comercio |
| `GET /api/square/oauth/callback` | `state` en cookie `httpOnly` | guarda los tokens cifrados y lista los IDs de locales |
| `POST /api/square/webhook` | HMAC-SHA256 de Square + dedupe por `event_id` | reservas en tiempo real |
| `GET /api/square/webhook` | pública | health-check (`{ ok: true }`) |
| `GET /api/cron/booking-automation` | `Authorization: Bearer $CRON_SECRET` | job diario |
| `GET /api/automation/test?key=…` | `AUTOMATION_ADMIN_KEY` (404 si no coincide) | autoprueba: simulación sobre visitas reales de la última semana (no envía ni guarda nada), o `&mode=email&to=<email>` para recibir las 2 plantillas reales |
| `GET/POST /api/automation/unsubscribe` | firma HMAC | baja (GET muestra botón, POST ejecuta) |

## Firestore

| Colección | Contenido |
|---|---|
| `squareConnections/{merchantId}` | tokens OAuth cifrados con AES-256-GCM, vencimiento, locales |
| `squareEvents/{eventId}` | marca de dedupe del webhook, se borra por TTL (`expireAt`, 30 días) |
| `bookings/{bookingId}` | última versión de la reserva + estado de `review` y `rebooking` |
| `customers/{merchantId}_{customerId}` | baja y última reseña pedida |
| `outbox/{bookingId}_{review\|rebooking}` | emails en cola con su `sendAt`; se borran al enviarse o descartarse |
| `automationRuns/{startedAt}` | resumen de cada corrida del cron (`ok`, `visitsProcessed`, `errors`…). Sirve para auditarlo, porque Vercel Hobby guarda los logs solo 1 hora |

Las reglas (`firestore.rules`) niegan todo acceso de cliente; solo el Admin SDK
del servidor lee y escribe. Los índices compuestos y la política TTL están en
`firestore.indexes.json`. Se crean desde la consola o con
`firebase deploy --only firestore:indexes`.

## Variables de entorno (Vercel → Production)

| Variable | Valor |
|---|---|
| `SQUARE_ENVIRONMENT` | `production` |
| `SQUARE_APPLICATION_ID` | `sq0idp-G6mu7_lz8zL09H36QAnmhA` |
| `SQUARE_APPLICATION_SECRET` | Square Developer → OAuth → Production Application secret |
| `SQUARE_OAUTH_REDIRECT_URL` | `https://mr-moustache.vercel.app/api/square/oauth/callback` |
| `SQUARE_WEBHOOK_NOTIFICATION_URL` | `https://mr-moustache.vercel.app/api/square/webhook` (tiene que coincidir **exacto** con la del webhook en Square) |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | la muestra Square al crear el webhook |
| `SQUARE_TOKEN_ENCRYPTION_KEY` | `openssl rand -base64 32` |
| `SQUARE_CONNECT_SECRET` | `openssl rand -base64 32` |
| `CRON_SECRET` | `openssl rand -hex 32` |
| `MARKETING_UNSUBSCRIBE_SECRET` | `openssl rand -base64 32` |
| `FIREBASE_PROJECT_ID` | `mr-moustache-automation` |
| `FIREBASE_CLIENT_EMAIL` | `mr-moustache-vercel@mr-moustache-automation.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | campo `private_key` del JSON de la cuenta de servicio (con los `\n`) |
| `SQUARE_LOCATION_ID_SURFERS_PARADISE` / `_BROADBEACH` | los muestra la página de callback |
| `GOOGLE_REVIEW_URL_SURFERS_PARADISE` / `_BROADBEACH` | opcional: por defecto se usa el link "escribir reseña" de cada local (`GOOGLE_PLACE_IDS` en `src/lib/constants.ts`) |
| `NEXT_PUBLIC_SITE_URL` | dominio real; se usa para armar los links de baja |
| `RESEND_API_KEY` | key de envío limitada al dominio verificado |
| `CUSTOMER_EMAIL_FROM` | p. ej. `Mr Moustache <hello@dominio>` (dominio verificado en Resend) |
| `CUSTOMER_EMAIL_REPLY_TO` | email real del negocio |
| `CUSTOMER_EMAIL_SIGNATURE` | opcional: firma de los emails; `\n` es salto de línea. P. ej. `Aitor\nMr Moustache Barbershop` (por defecto `Mr Moustache Barbershop`) |
| `REVIEW_AUTOMATION_ENABLED` / `REBOOKING_AUTOMATION_ENABLED` | `false` hasta la prueba final |
| `AUTOMATION_ADMIN_KEY` | opcional: clave para `/api/automation/test` (`openssl rand -hex 24`). Sin ella la ruta da 404 |
| `AUTOMATION_TEST_EMAILS` | opcional: emails separados por coma. Si tiene valor, **solo** esos reciben emails y el resto queda `skipped: not_test_recipient`. Vaciarla para el lanzamiento |

Rotar `SQUARE_TOKEN_ENCRYPTION_KEY` deja ilegibles los tokens guardados. En ese
caso hay que volver a conectar Square con `/api/square/oauth/start`. Rotar
`MARKETING_UNSUBSCRIBE_SECRET` invalida los links de baja de emails ya enviados.

## Puesta en marcha

1. Cargar las variables de Square (menos la signature key), Firebase, los
   secretos generados y los flags en `false`. Desplegar.
2. Comprobar que `GET /api/square/webhook` responde `{ "ok": true }`.
3. En Square Developer → Webhooks → Production, crear la suscripción a
   `https://mr-moustache.vercel.app/api/square/webhook` con `booking.created`
   y `booking.updated`. Copiar la signature key a Vercel y redesplegar.
   Mandar un test event: debe responder 200.
4. Abrir `/api/square/oauth/start?key=<SQUARE_CONNECT_SECRET>` con la cuenta del
   dueño en Square y aceptar. La página final muestra el merchant y los IDs
   de local. Cargarlos en `SQUARE_LOCATION_ID_*` y redesplegar.
5. En Firestore, crear los índices de `firestore.indexes.json`. La TTL de
   `squareEvents.expireAt` es opcional: sin ella, esos documentos chicos
   simplemente se acumulan.
6. Dejar correr el cron unos días con los flags apagados y revisar que
   `bookings/` se llene y que las visitas queden `skipped: disabled`.
7. Prueba real (con Resend ya configurado): `AUTOMATION_TEST_EMAILS=<tu email>` y los dos flags en
   `true`, crear en Square una reserva corta para un cliente con ese email.
   Cuando termine, correr el cron desde Vercel → Settings → Cron Jobs → Run y
   revisar en `bookings/` que `review` y `rebooking` queden `scheduled` y que
   estén en `outbox/`. Correrlo otra vez no debe crear más. Para ver las
   plantillas sin reserva: `/api/automation/test?key=…&mode=email&to=<email>`.
8. Con el dominio verificado en Resend: cargar la key y el `from`, y activar
   primero `REVIEW_AUTOMATION_ENABLED` y después `REBOOKING_AUTOMATION_ENABLED`.

Para correr el cron a mano:
`curl -H "Authorization: Bearer $CRON_SECRET" https://mr-moustache.vercel.app/api/cron/booking-automation`.
Devuelve un resumen y responde 500 si hubo errores parciales (detalle en los
logs de Vercel).

## Desarrollo

```bash
npm test       # tests unitarios (node:test + tsx)
npm run check  # lint + tests + build
```
