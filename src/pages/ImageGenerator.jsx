import { useState } from 'react';
import { Wand2, Loader2, ImageIcon } from 'lucide-react';
import RobotMascot from '../components/RobotMascot.jsx';

const STYLES = ['Realistic', 'Anime', 'Cyberpunk', '3D Render', 'Watercolor', 'Minimalist'];
const RATIOS = ['1:1', '16:9', '9:16', '4:3'];

// Mendeteksi apakah respons AI berisi URL gambar langsung.
function extractImageUrl(text) {
  const match = text?.match(/https?:\/\/\S+\.(png|jpe?g|webp|gif)(\?\S*)?/i);
  return match ? match[0] : null;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(STYLES[0]);
  const [ratio, setRatio] = useState(RATIOS[0]);
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError('');

    const composedPrompt = `Buatkan gambar dengan gaya ${style}, rasio aspek ${ratio}, deskripsi: ${prompt}`;

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: composedPrompt, files: '' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat gambar.');

      const imageUrl = extractImageUrl(data.result);
      setGallery((prev) => [
        { id: Date.now(), prompt, style, ratio, imageUrl, text: data.result },
        ...prev
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <span className="eyebrow">Image Generator</span>
      <h1 style={{ fontSize: 26, marginTop: 10, marginBottom: 20 }}>Ubah teks menjadi visual</h1>

      <div className="glass" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Deskripsikan gambar yang kamu inginkan…"
          rows={3}
          style={{
            width: '100%',
            background: 'rgba(148,163,255,0.06)',
            border: '1px solid var(--border-soft)',
            borderRadius: 12,
            padding: 14,
            color: 'var(--text-hi)',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            resize: 'vertical'
          }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p className="text-low" style={{ fontSize: 11.5, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Style</p>
            <div className="segmented" style={{ flexWrap: 'wrap' }}>
              {STYLES.map((s) => (
                <button key={s} type="button" className={style === s ? 'active' : ''} onClick={() => setStyle(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-low" style={{ fontSize: 11.5, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Aspect ratio</p>
            <div className="segmented">
              {RATIOS.map((r) => (
                <button key={r} type="button" className={ratio === r ? 'active' : ''} onClick={() => setRatio(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleGenerate} disabled={!prompt.trim() || loading} style={{ alignSelf: 'flex-start' }}>
          {loading ? <Loader2 size={16} className="spin" /> : <Wand2 size={16} />}
          {loading ? 'Membuat gambar…' : 'Generate'}
        </button>
        {error && <p style={{ fontSize: 12.5, color: '#ffb3b3' }}>{error}</p>}
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}>
          <RobotMascot state="thinking" size={110} />
        </div>
      )}

      <div className="section-head">
        <h2>Gallery</h2>
      </div>

      {gallery.length === 0 ? (
        <div className="glass-panel" style={{ padding: 26, textAlign: 'center' }}>
          <ImageIcon size={24} color="var(--text-low)" style={{ marginBottom: 8 }} />
          <p className="text-muted" style={{ fontSize: 13 }}>Hasil generate akan muncul di sini.</p>
        </div>
      ) : (
        <div className="tools-grid">
          {gallery.map((g) => (
            <div key={g.id} className="glass-panel" style={{ padding: 14 }}>
              {g.imageUrl ? (
                <img src={g.imageUrl} alt={g.prompt} style={{ width: '100%', borderRadius: 10, marginBottom: 10, display: 'block' }} />
              ) : (
                <div
                  style={{
                    fontSize: 12.5,
                    color: 'var(--text-mid)',
                    background: 'rgba(148,163,255,0.06)',
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 10,
                    maxHeight: 140,
                    overflow: 'auto'
                  }}
                >
                  {g.text}
                </div>
              )}
              <p style={{ fontSize: 12.5, fontWeight: 600 }}>{g.prompt}</p>
              <p className="text-low" style={{ fontSize: 11 }}>{g.style} · {g.ratio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
