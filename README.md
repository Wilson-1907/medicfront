# Vercel Frontend Deployment

This folder is a Vercel edge proxy for the Render backend.

## Purpose

- Make `medicfront` domain show the real hospital console
- Proxy all requests to Render backend (`medicback`)

## Deploy Steps

1. Import repository into Vercel.
2. Set root directory to `deploy/vercel`.
3. Deploy.
4. Vercel rewrites all paths to:
   - `https://medicback.onrender.com/$1`

## Backend Integration

Africa's Talking webhook callbacks should still point directly to Render backend URLs:

- `https://medicback.onrender.com/webhook_africastalking.php`
- `https://medicback.onrender.com/webhook_delivery_report.php`
