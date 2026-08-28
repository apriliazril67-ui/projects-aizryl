# AzryAI

**Your AI Companion of the Future** — aplikasi web AI futuristik bertema galaxy, dengan maskot robot hologram, chat AI, image generator, voice assistant, dan lebih banyak lagi.

Dibangun dengan **React + Vite** (frontend) dan **Vercel Serverless Functions** (backend proxy), sehingga API key AI tidak pernah terekspos ke browser.

---

## ✨ Fitur

- AI Chat (markdown, code block, typing animation, copy/regenerate, riwayat chat)
- Image Generator (prompt, style, aspect ratio, gallery)
- Voice Assistant (mic, waveform, transkripsi, respons suara via Web Speech API)
- Smart Search, Code Assistant, Math Solver, Translator, Summarizer, AI Planner (semua lewat AI Chat dengan konteks tool)
- Dashboard dengan quick actions & recent chats
- Sidebar futuristik (desktop) + bottom navigation (mobile)
- Robot maskot dengan animasi idle / thinking / responding
- Dark/Light mode, toggle animasi & suara, ganti bahasa, hapus riwayat
- Background galaxy: starfield canvas, nebula, floating planet, particle bergerak
- Glassmorphism + neon cyan/violet/pink, fully responsive (Android, iPhone, tablet, desktop)

## 🧱 Struktur proyek

```
azryai/
├── api/
│   └── ai.js              # Vercel Serverless Function (proxy aman ke Sylvatica AI)
├── src/
│   ├── components/        # Layout, Sidebar, BottomNav, RobotMascot, GalaxyBackground, dll.
│   ├── pages/              # Home, Dashboard, Chat, Tools, ImageGenerator, VoiceAssistant, History, Profile, Settings
│   ├── hooks/useChat.js    # State percakapan + pemanggilan backend
│   ├── context/            # SettingsContext (theme, animasi, suara, bahasa)
│   ├── styles/              # Design tokens & CSS per bagian
│   └── App.jsx / main.jsx
├── public/
├── .env.example
├── package.json
├── vercel.json
└── vite.config.js
```

## 🔐 Keamanan API key

- API key **hanya** disimpan di environment variable `SYLVATICA_API_KEY` di server (Vercel).
- Frontend **tidak pernah** memanggil `https://sylvatica.my.id/api/ai/cloude` secara langsung.
- Frontend memanggil `POST /api/ai` milik aplikasi sendiri → backend (`api/ai.js`) yang meneruskan request ke Sylvatica dengan API key dari `process.env.SYLVATICA_API_KEY`.
- Tidak ada API key yang disimpan di localStorage, di-hardcode, atau ditampilkan pada pesan error.
- Input divalidasi di backend, ada timeout 30 detik, dan rate-limit dasar (20 request/menit per IP) sebagai placeholder — untuk produksi, sambungkan ke Vercel KV/Upstash Redis agar limitnya konsisten lintas instance serverless.

## 🚀 Menjalankan secara lokal

### 1. Install dependency

```bash
npm install
```

### 2. Siapkan environment variable

```bash
cp .env.example .env
```

Buka `.env` dan isi:

```
SYLVATICA_API_KEY=YOUR_API_KEY_HERE
```

### 3. Jalankan lokal

Cara paling akurat (menjalankan frontend **dan** serverless function `api/ai.js` sekaligus) adalah menggunakan Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

Buka `http://localhost:3000`.

> Jika hanya menjalankan `npm run dev` (Vite biasa), endpoint `/api/ai` tidak akan tersedia karena itu adalah serverless function khusus Vercel — gunakan `vercel dev` untuk pengujian penuh end-to-end.

## ☁️ Deploy ke Vercel

1. Push project ini ke repository Git (GitHub/GitLab/Bitbucket).
2. Buka [vercel.com](https://vercel.com) → **New Project** → import repository ini.
3. Masuk ke **Project Settings → Environment Variables**, tambahkan:
   - `SYLVATICA_API_KEY` = API key kamu (isi untuk Production, Preview, dan Development).
4. Klik **Deploy**. Vercel otomatis mendeteksi framework Vite dan menjalankan `npm run build`.
5. Setelah selesai, Vercel memberikan URL public seperti `https://azryai-xxxx.vercel.app` — itulah alamat aplikasi AzryAI kamu yang siap dipakai.

Untuk deploy ulang setelah perubahan kode, cukup `git push` ke branch yang terhubung — Vercel akan build & deploy otomatis.

## 🛠️ Teknologi

- React 18 + Vite 5
- React Router v6
- Vercel Serverless Functions (Node.js runtime)
- `marked` untuk rendering markdown pada chat
- `lucide-react` untuk ikon
- Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) untuk Voice Assistant — didukung penuh di Chrome/Edge; browser lain akan menampilkan pesan fallback.

## 📝 Catatan tentang Image Generator

Endpoint yang disediakan (`/api/ai/cloude`) adalah endpoint chat berbasis teks (`q`, `files`, `apikey`). Halaman **Image Generator** mengirim prompt terstruktur ke endpoint yang sama lewat backend; jika respons AI berupa URL gambar, gambar akan ditampilkan otomatis di galeri, jika berupa teks maka teks tersebut ditampilkan sebagai hasil. Jika kamu memiliki endpoint image-generation khusus dari Sylvatica, tinggal sesuaikan `UPSTREAM_BASE` atau tambahkan endpoint baru di `api/ai.js`.
