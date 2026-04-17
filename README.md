# Vercel Frontend Deployment

This folder contains the actual frontend app for the hospital console.

## Purpose

- Host hospital console UI on Vercel
- Call backend JSON APIs hosted on Render

## Deploy Steps

1. Import repository into Vercel.
2. Set root directory to `deploy/vercel`.
3. Deploy.
4. Edit `config.js` and set:
   - `BACKEND_BASE_URL=https://medicback.onrender.com`

## Backend Integration

Africa's Talking webhook callbacks must point to Render backend URLs:

- `https://medicback.onrender.com/webhook_africastalking.php`
- `https://medicback.onrender.com/webhook_delivery_report.php`
