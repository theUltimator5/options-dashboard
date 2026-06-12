# Options Dashboard — Alpaca Market Data

A real-time options analytics dashboard built on Alpaca's Market Data API.
Displays price charts, options chain with Greeks, exposure heatmap, and unusual flow.

## Features
- Candlestick price chart (1D / 2H / 6H timeframes)
- Options chain with Delta, Gamma, Theta, Vega
- Exposure heatmap — calls vs puts OI by strike
- Unusual trades feed (sweeps & blocks)
- Falls back to realistic mock data if API keys aren't set

---

## Deploy to Vercel (5 minutes)

### Step 1 — Get the code on GitHub

1. Go to [github.com](https://github.com) and create a free account if you don't have one
2. Click **New repository** → name it `options-dashboard` → click **Create**
3. Upload all the files from this folder to the repo
   (drag and drop them onto the GitHub page, or use GitHub Desktop)

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **Add New Project**
3. Select your `options-dashboard` repository
4. Click **Deploy** — Vercel will auto-detect the config

### Step 3 — Add your Alpaca API keys

1. In Vercel, go to your project → **Settings** → **Environment Variables**
2. Add these two variables:

   | Name | Value |
   |------|-------|
   | `ALPACA_API_KEY` | Your Alpaca API Key ID |
   | `ALPACA_API_SECRET` | Your Alpaca Secret Key |

3. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

Your dashboard is now live at `https://your-project.vercel.app` 🎉

---

## Run locally

```bash
npm install
npx vercel dev
```

Then open http://localhost:3000

Set your keys in a `.env.local` file:
```
ALPACA_API_KEY=your_key_here
ALPACA_API_SECRET=your_secret_here
```

---

## Project structure

```
alpaca-dashboard/
├── api/
│   ├── quote.js        # Latest quote + bar for a symbol
│   ├── bars.js         # Historical OHLCV bars
│   └── options.js      # Options chain with Greeks
├── public/
│   └── index.html      # The dashboard UI
├── vercel.json         # Vercel routing config
└── package.json
```

## API endpoints

| Endpoint | Params | Returns |
|----------|--------|---------|
| `/api/quote?symbol=GME` | symbol | Latest quote + bar |
| `/api/bars?symbol=GME&timeframe=1Day&limit=30` | symbol, timeframe, limit | OHLCV array |
| `/api/options?symbol=GME` | symbol, expiration (optional) | Options contracts + Greeks |

## Notes

- Market data requires a **free Alpaca account** — no deposit needed
- Options data (Greeks, IV) requires Alpaca's **options data subscription**
- The dashboard works with mock data until API keys are added
- Never commit your `.env.local` file or expose your secret key in frontend code
