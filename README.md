# avinashsanaka.github.io — Portfolio

Tech noir portfolio with AI chatbot powered by Claude API.

---

## Step 1 — Create the GitHub repo

1. Go to github.com → **New repository**
2. Name it exactly: `avinashsanaka.github.io`
3. Set it to **Public**
4. **Do not** add a README (you already have files)
5. Click **Create repository**

## Step 2 — Push the site

Open a terminal in this folder (`C:\Users\Avinash.Sanaka\portfolio`) and run:

```bash
git init
git add index.html
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/avinashsanaka/avinashsanaka.github.io.git
git push -u origin main
```

GitHub Pages auto-deploys from the `main` branch root. Your site goes live at:
**https://avinashsanaka.github.io** (takes ~1 minute)

---

## Step 3 — Deploy the Cloudflare Worker (chatbot backend)

The chatbot needs a Worker so your API key stays private.

### Prerequisites
```bash
npm install -g wrangler
```

### Deploy
```bash
# From this portfolio folder:
wrangler login
wrangler deploy
```

You'll get a URL like: `https://avinash-portfolio-worker.YOUR-SUBDOMAIN.workers.dev`

### Add your API key as a secret
```bash
wrangler secret put ANTHROPIC_API_KEY
# Paste your key from console.anthropic.com when prompted
```

---

## Step 4 — Wire the Worker URL into the site

Open `index.html` and find this line near the top of the `<script>`:

```js
const WORKER_URL = 'YOUR_CLOUDFLARE_WORKER_URL_HERE';
```

Replace it with your actual Worker URL:

```js
const WORKER_URL = 'https://avinash-portfolio-worker.YOUR-SUBDOMAIN.workers.dev';
```

Then push the update:

```bash
git add index.html
git commit -m "Wire chatbot Worker URL"
git push
```

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Complete single-file portfolio (HTML + CSS + JS) |
| `worker.js` | Cloudflare Worker — proxies Claude API, hides key |
| `wrangler.toml` | Worker config |

---

## Chatbot cost estimate

Uses `claude-haiku-4-5-20251001` — the cheapest Claude model (~$0.25/M input tokens).
A typical chat exchange costs < $0.001. Cloudflare Workers free tier = 100,000 requests/day.
Effectively free for a portfolio.

---

## Customization notes

- **WORKER_URL** in `index.html` → your Cloudflare Worker URL
- **Email** is already set to `avinashsanaka1@gmail.com`
- **Skill data** is in the `SD` object in `index.html` — edit levels/descriptions freely
- **Radar chart** skills are in the `skills` array inside the radar IIFE
- **System prompt** for the chatbot is the `SYS` constant — update if anything changes
