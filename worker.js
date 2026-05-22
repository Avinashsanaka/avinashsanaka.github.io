/**
 * Cloudflare Worker — Claude API proxy for avinashsanaka.github.io
 *
 * Deploy steps (5 minutes):
 *  1. npx wrangler login
 *  2. npx wrangler deploy
 *  3. npx wrangler secret put ANTHROPIC_API_KEY
 *  4. Copy the Worker URL into index.html → WORKER_URL
 */

const ALLOWED_ORIGIN = 'https://avinashsanaka.github.io';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON', { status: 400, headers: CORS_HEADERS });
    }

    if (body.type === 'lead') {
      return saveLead(body, env);
    }

    // Basic validation
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response('Missing messages', { status: 400, headers: CORS_HEADERS });
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: body.system || '',
        messages: body.messages,
      }),
    });

    const data = await anthropicRes.json();

    return new Response(JSON.stringify(data), {
      status: anthropicRes.ok ? 200 : anthropicRes.status,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  },
};

async function saveLead(body, env) {
  const name = sanitizeText(body.name || '').slice(0, 120);
  const email = sanitizeText(body.email || '').slice(0, 180);
  const page = sanitizeText(body.page || '').slice(0, 500);
  const transcript = Array.isArray(body.transcript) ? body.transcript.slice(-10) : [];

  if (!name || !isValidEmail(email)) {
    return json({ error: 'Invalid lead' }, 400);
  }

  if (!env.LEADS) {
    return json({ error: 'Lead storage not configured' }, 501);
  }

  const createdAt = new Date().toISOString();
  const id = `lead:${createdAt}:${crypto.randomUUID()}`;

  await env.LEADS.put(id, JSON.stringify({
    id,
    name,
    email,
    page,
    createdAt,
    transcript,
  }));

  return json({ ok: true, id });
}

function sanitizeText(value) {
  return String(value).replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
