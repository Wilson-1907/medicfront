# Medicfront — HPV Patient Engagement Console

Static console for **Nyeri Town Health Center**. Talks to the PHP API on Render ([medicback](https://github.com/Wilson-1907/medicback)).

## Deploy (Vercel)

1. Import this repository.
2. Set **Root Directory** to `deploy/vercel` (or deploy this folder as the project root).
3. Set `BACKEND_BASE_URL` in `config.js` if not using the default Render URL.
4. Deploy.

Production example: `https://medicfront-neon.vercel.app`

## Configuration

Edit `config.js`:

- `BACKEND_BASE_URL` — medicback API base URL
- `APP_NAME`, `CLIENT_ID_PREFIX` — facility branding and lab client ID prefix (`NC/NTHC/001/`)

## Quality checks

```bash
npm install
npm run monkey    # API registration, duplicates, endpoints
npm run smoke     # Browser navigation and patient detail
npm run test:launch   # Both
```

Optional: `node smoke/mock-api.mjs` — HPV/escalation API smoke against production.

## Webhooks (backend only)

Inbound SMS/WhatsApp and delivery reports are handled on **medicback**, not Vercel:

- `/webhook_africastalking.php`
- `/webhook_delivery_report.php`
