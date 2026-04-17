# Vercel Frontend Deployment

This folder is a separate frontend deployment target for Vercel.

## Purpose

- Host a public/static frontend
- Keep backend/webhooks on Render

## Deploy Steps

1. Import repository into Vercel.
2. Set root directory to `deploy/vercel`.
3. Deploy as static project.

## Backend Integration

Point frontend links/API calls to your Render backend:

- `https://YOUR-RENDER-APP.onrender.com`

Important: Africa's Talking webhook callbacks must remain on the Render backend, not Vercel static hosting.
