# MegaStar Tutoring

Private tutoring platform scaffold for Vercel.

## Run locally

```bash
npm install
npm run dev
```

## Routes

- `/` - public landing page
- `/app` - tutor dashboard
- `/dashboard` - client portal

## Production env

For the live classroom, set these environment variables in production:

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `LIVEKIT_TOKEN_TTL_SECONDS` optional, defaults to `43200` for long classroom sessions

The classroom token endpoint will also accept `NEXT_PUBLIC_LIVEKIT_URL` for backwards compatibility, but `LIVEKIT_URL` is the preferred production variable because the client now learns the room URL from the server response.

## Notes

- A custom domain is optional at first.
- Vercel can host the app on a free `*.vercel.app` URL.
- Buy a domain later only if you want the brand to feel more official.
