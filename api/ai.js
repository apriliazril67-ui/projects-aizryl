// api/ai.js
// Vercel Serverless Function — proxy aman ke Sylvatica AI API.
// API key TIDAK PERNAH dikirim ke browser. Semua request dari frontend
// masuk ke sini dulu (POST /api/ai), baru diteruskan ke provider AI.

const UPSTREAM_BASE = 'https://sylvatica.my.id/api/ai/mistral';

// ---- Rate limit placeholder (in-memory, per instance) -----------------
// Catatan: serverless function bersifat stateless/ephemeral, jadi ini
// hanya proteksi dasar untuk satu instance yang sedang "hangat".
// Untuk proteksi produksi yang solid, ganti dengan Vercel KV / Upstash
// Redis / Vercel Edge Config + Rate Limit.
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 menit
const RATE_LIMIT_MAX_REQUESTS = 20; // maksimal 20 request/menit per IP

function isRateLimited(identifier) {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(identifier, { windowStart: now, count: 1 });
    return false;
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  return false;
}

function getClientIdentifier(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

// ---- Validasi input -----------------------------------------------------
function validateInput(body) {
  if (!body || typeof body !== 'object') {
    return 'Body request tidak valid.';
  }
  const { q } = body;
  if (typeof q !== 'string' || q.trim().length === 0) {
    return 'Pertanyaan (q) wajib diisi dan berupa teks.';
  }
  if (q.length > 6000) {
    return 'Pertanyaan terlalu panjang. Maksimal 6000 karakter.';
  }
  return null;
}

export default async function handler(req, res) {
  // CORS dasar — hanya izinkan same-origin di produksi jika diperlukan
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan. Gunakan POST.' });
  }

  const identifier = getClientIdentifier(req);
  if (isRateLimited(identifier)) {
    return res.status(429).json({
      error: 'Terlalu banyak permintaan. Silakan tunggu sebentar lalu coba lagi.'
    });
  }

  const validationError = validateInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const apiKey = process.env.SYLVATICA_API_KEY;
  if (!apiKey) {
    // Jangan pernah bocorkan detail environment/secret ke client.
    console.error('SYLVATICA_API_KEY belum diatur di environment variables.');
    return res.status(500).json({
      error: 'Layanan AI belum dikonfigurasi dengan benar. Silakan hubungi admin.'
    });
  }

  const { q } = req.body;

  const url = new URL(UPSTREAM_BASE);
  url.searchParams.set('query', q);
  url.searchParams.set('apikey', apiKey);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 detik timeout

    const upstreamResponse = await fetch(url.toString(), {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!upstreamResponse.ok) {
      console.error(`Upstream AI error: status ${upstreamResponse.status}`);
      return res.status(502).json({
        error: 'AI sedang mengalami gangguan. Silakan coba lagi dalam beberapa saat.'
      });
    }

    const contentType = upstreamResponse.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await upstreamResponse.json();
    } else {
      const text = await upstreamResponse.text();
      data = { result: text };
    }

    // Normalisasi bentuk respons agar frontend selalu menerima { result }
    const result =
      data.result ??
      data.message ??
      data.answer ??
      data.response ??
      data.text ??
      (typeof data === 'string' ? data : JSON.stringify(data));

    return res.status(200).json({ result });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Permintaan ke AI memakan waktu terlalu lama. Coba lagi.' });
    }
    console.error('Proxy error:', err.message);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server. Silakan coba lagi.' });
  }
}
