# Portfolio — Avinash Sanaka (avinashsanaka.github.io)

## Project Overview

Single-file personal portfolio site hosted on GitHub Pages. The entire site lives in `index.html` with a companion Cloudflare Worker proxy in `worker.js`. No build tools, no frameworks, no external JS libraries — pure HTML/CSS/JS.

## Owner

- **Name:** Avinash Sanaka
- **Email:** avinashsanaka1@gmail.com
- **GitHub Pages:** https://avinashsanaka.github.io
- **Location:** Timmins, ON, Canada
- **Education:** B.Tech Computer Science, JNTU Hyderabad, India

## What Avinash Does

Software Engineer with 5 years of experience across three overlapping domains:

- **Data Engineering** — Python automation frameworks, ETL/ELT pipelines, data quality at scale, Spark, Airflow, Kafka, PostgreSQL, MySQL, Hadoop, AWS S3
- **AI Development** — Claude API, MCP, OpenAI Codex, NVIDIA NIM, multi-model orchestration, n8n, prompt engineering, agent workflows
- **Automation & Systems** — distributed system testing (Cisco), validation frameworks, anomaly detection, referential integrity at 1,000+ table scale

Looking for: AI engineering, data engineering, platform engineering, automation roles. Open to remote. Actively available.

---

## File Structure

```
portfolio/
├── index.html    # Entire site — HTML, CSS, JS in one file (~1400 lines)
├── worker.js     # Cloudflare Worker proxy for Claude API
└── CLAUDE.md     # This file
```

### index.html layout

1. `<head>` — meta tags, Google Fonts, all CSS in `<style>`
2. `<body>` — full HTML markup for every section
3. `<script>` — all JavaScript (particles, typewriter, scroll reveal, radar, chatbot, skill modals)

### worker.js

Cloudflare Worker that proxies POST `{system, messages}` to Anthropic API. Keeps API key server-side. Uses `claude-haiku-4-5-20251001`. CORS locked to `https://avinashsanaka.github.io`.

**Deploy:**
```bash
npx wrangler login
npx wrangler deploy
npx wrangler secret put ANTHROPIC_API_KEY   # paste key when prompted
# copy the *.workers.dev URL → paste into WORKER_URL in index.html
```

---

## Design System

### Aesthetic

Tech noir / dark terminal — deep space backgrounds with neon cyan and purple accents. Hacker terminal meets data pipeline visualization. Every element should feel like it belongs on a monitoring dashboard or a high-end CLI tool.

### Color Tokens

```css
--bg:        #070710   /* deep navy-black */
--surface:   #0c0c1a
--surface2:  #11112a
--border:    #1a1a3a
--borderB:   #252550
--cyan:      #00d4ff   /* primary accent — interactive elements, headings */
--cyanDim:   rgba(0,212,255,0.08)
--cyanGlow:  rgba(0,212,255,0.35)
--purple:    #8b5cf6   /* secondary — tags, badges */
--purpleDim: rgba(139,92,246,0.08)
--green:     #00ff88   /* status indicators */
--greenDim:  rgba(0,255,136,0.08)
--text:      #e2e8f0
--textM:     #7a8899   /* muted */
--textD:     #2a3040   /* very dim */
```

### Typography

| Variable | Family | Used for |
|---|---|---|
| `--mono` | JetBrains Mono | Nav, labels, chips, buttons, code elements |
| `--sans` | Space Grotesk | Main headings, role titles, stat numbers |
| `--body` | Inter | Body copy, chat messages, bullet text |

### Visual Motifs

- **Parallelogram buttons** — `clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)`
- **Diamond timeline markers** — rotated square `::before { transform: rotate(45deg) }`
- **Gradient rules** — `linear-gradient(to right, var(--cyan), transparent)`
- **Neon glow** — `box-shadow: 0 0 Npx var(--cyanGlow)`
- **Left accent bar** — `width: 3px; background: var(--cyan)` on left edge of cards
- **Section headers** — `[num] [ALL CAPS MONO LABEL] ─────────────` (`.sec-head` pattern)

---

## Site Sections

| # | Section | ID | Description |
|---|---|---|---|
| — | Hero | `#hero` | Animated typewriter, hexagonal AS avatar (glowing, pulsing), status badge, CTA buttons |
| — | Stats | `#stats` | 4 animated counter cards (5 yrs, 4027 anomalies, 20+ domains, 1000+ tables) |
| 01 | About | `#about` | Two-column: bio text left, 3 highlight cards right |
| 02 | Skills | `#skills` | Categorized chip grid + SVG radar chart; chips open a detail modal |
| 03 | Experience | `#experience` | Scroll-reveal timeline — Kunuwanimano (current), Cisco, Perfex |
| 04 | Projects | `#projects` | 2 cards: AI Financial Platform, AI Agent Workflows |
| 05 | Contact | `#contact` | Centered card with email + open chat CTA |
| — | Chatbot | `#chat-widget` | Fixed bottom-right floating widget; Claude-powered via Worker proxy |

---

## JavaScript Components

### Particle Background
Canvas-based floating dots with connection lines. Cyan/purple dots. Auto-sized to viewport. Lines fade based on distance (max 130px). Controlled by the IIFE at the top of `<script>`.

### Typewriter
Cycles through `phrases` array in `<script>`. Configurable delay constants. The `#tw-text` span is updated character by character.

### Counter Animation
Triggered by IntersectionObserver on `.stat-n` elements. Uses `data-target` attribute for the final number and optional `data-sfx` for a suffix (e.g. `"+"`).

### Scroll Reveal
IntersectionObserver on `.fi` (fade-in) and `.t-item` (timeline items). Adds `.vis` class which transitions opacity and transform.

### Radar Chart
Pure canvas drawing. 6 axes: Python/SQL, AI/ML, Data Eng, Systems/Infra, Test Automation, Visualization. Axes and values defined in the `radarAxes` array in `<script>`.

### Skill Modal
`SKILLS` object maps skill keys to `{name, level, desc, tags}`. Chips call `showSkill(key)`. Modal animates in with cubic-bezier spring. Proficiency bar animates on open.

### Chatbot
- `WORKER_URL` — must be set to deployed Cloudflare Worker URL
- `SYS` constant — full system prompt with Avinash's bio, work history, skills, guidelines
- `history` array — rolling 20-message window
- Sends `POST {system, messages}` → expects `data.content[0].text` (Anthropic format)
- `sendSugg(btn)` — suggestion chips pre-fill and auto-send

---

## Skills Data (SKILLS object)

Defined in `<script>`. Format:
```js
skillKey: {
  name: 'Display Name',
  level: 85,          // 0–100, drives radar + modal progress bar
  desc: 'One paragraph description',
  tags: ['Related', 'Concepts', 'Tools']
}
```

Current keys: `python`, `sql`, `java`, `scala`, `nodejs`, `tcl`, `claude`, `mcp`, `openai`, `nvidia`, `n8n`, `prompt`, `spark`, `airflow`, `kafka`, `etl`, `cicd`, `postgres`, `mysql`, `aws`, `hadoop`, `tableau`, `powerbi`, `testing`, `git`

---

## Pending Work

1. **[ ] Deploy Cloudflare Worker** — run wrangler deploy, set API key secret, update `WORKER_URL` in index.html (~5 min)
2. **[ ] Design refresh** — more creative visuals; data engineering theme; currently too minimal
3. **[ ] Data Engineering positioning** — surface data engineering more prominently alongside AI/Automation identity
4. **[ ] CS degree** — add B.Tech Computer Science, JNTU Hyderabad to About/Education section

---

## Coding Conventions

- **Everything in one file** — do not split into separate CSS/JS files (GitHub Pages static constraint, no build step)
- **No build tools** — no npm, webpack, Vite, etc.
- **No external JS libraries** — vanilla JS only; no jQuery, React, lodash, etc.
- **CSS variables always** — use `var(--name)` for every color and font; never hardcode hex inside rules
- **Minimal comments** — only where the WHY is non-obvious; no section narration
- **Responsive breakpoints** — 768px (mobile nav hides, single-column layouts) and 480px (single-column stats)
- **Monospace for UI chrome** — all labels, buttons, chips, nav links use `var(--mono)`
- **Semantic IDs** — section IDs match nav `href` anchors exactly

---

## How to Work on This Project

### Before any change
1. Read the affected section of `index.html` — CSS, HTML markup, and JS if relevant
2. Identify which CSS tokens and classes are involved
3. Check that the change fits the tech noir aesthetic before implementing

### Adding a new section
1. Add `<div class="container" id="sectionname">` in the HTML body
2. Add nav link: `<li><a href="#sectionname" data-n="0N">Label</a></li>`
3. Open with `<div class="sec-head fi"><span class="sec-num">0N</span><span class="sec-ttl">Label</span><div class="sec-rule"></div></div>`
4. Apply `.fi` class on content containers for scroll reveal
5. Update the chatbot `SYS` system prompt if the new content is about Avinash

### Adding a skill chip
1. Add `<span class="chip" onclick="showSkill('key')">Label</span>` in the appropriate category div
2. Add matching entry in the `SKILLS` object in `<script>`
3. Consider updating `radarAxes` if it's a new skill category

### Design change checklist
- [ ] All colors reference `var(--*)` tokens
- [ ] All fonts reference `var(--mono)`, `var(--sans)`, or `var(--body)`
- [ ] Hover states have `transition` properties
- [ ] New elements look consistent with the dark terminal aesthetic
- [ ] Mobile breakpoints still work at 768px
- [ ] No new external dependencies added
- [ ] No build step introduced

### When editing chatbot content
- Edit the `SYS` constant in `<script>` (around line 1288)
- Keep responses factual — never add numbers, companies, or dates not listed in SYS
- The model is set in `worker.js` (`claude-haiku-4-5-20251001`) — change it there, not in index.html

---

## Brainstorming — Design Improvement Ideas

The current design is solid but minimal. Ideas for making it more visually striking while keeping the tech noir identity:

### Data pipeline / DAG visualization
Replace or augment the particle background with animated directed-graph nodes representing a data pipeline — nodes labeled with actual tools (Python → Spark → PostgreSQL → Dashboard). Fits the data engineering identity perfectly.

### Terminal hero variant
Replace the simple typewriter with a fake terminal window that "runs commands" — e.g. `$ python validate.py --domain all` → output lines stream in showing stats. More visceral and memorable.

### Live data stream effect
A scrolling strip of fake log lines or database records flowing across the bottom of the hero — like a real data pipeline in motion. Reinforces the data engineering brand.

### Skill dependency graph
Replace the radar chart with an interactive node graph showing how skills connect (Python → Spark, SQL → Airflow, Claude API → MCP). More interesting than a polygon.

### Scanline / CRT effects
Subtle horizontal scanlines over the background, or a very faint vignette. Classic tech noir effect that adds texture without noise.

### Animated section transitions
As you scroll into each section, content could "compile" or "load" rather than just fade up — terminal-style character reveals, line-by-line renders.
