# TechFest 2026

React (Vite) frontend + Express/MongoDB backend.

```
Browser ──► React app (Netlify) ──/api proxy──► Express API (Render) ──► MongoDB Atlas
```

## Run locally

```sh
# backend (needs backend/.env with MONGO_URI, JWT_SECRET, PORT=5000)
cd backend && npm install && npm start
# frontend (proxies /api to localhost:5000)
npm install && npm run dev
```

Tests: `cd backend && npm test`. Build: `npm run build`.

## Security

- `helmet()` adds security headers (CSP, no-sniff, frame blocking).
- `express-mongo-sanitize` strips `$`/`.` keys from request bodies, so `{"email": {"$ne": null}}` can't bypass login.
- User text is rendered by React as plain text (never `dangerouslySetInnerHTML`), so `<script>` shows as text.
- The JWT is sent as a cookie with `httpOnly` (JS can't read it), `secure` (HTTPS only) and `sameSite: "strict"`.
  **CSRF** is when another site makes your browser send a request to this API with your cookie attached.
  `sameSite: "strict"` tells the browser not to attach the cookie to requests that start on another site.

## Deploy

- **Backend (Render):** Web Service, root directory `backend`, start command `npm start`, env `MONGO_URI`, `JWT_SECRET`.
- **Frontend (Netlify):** uses `netlify.toml`. Put your Render URL in its `/api/*` redirect. The API stays on the
  same site as the page, which keeps the `sameSite: "strict"` cookie working.
