import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ImageIcon,
  Mic,
  Search,
  Code2,
  Calculator,
  Languages,
  FileText,
  CalendarClock,
  ArrowRight
} from 'lucide-react';
import RobotMascot from '../components/RobotMascot.jsx';
import ToolCard from '../components/ToolCard.jsx';
import { useChat } from '../hooks/useChat.js';
import '../styles/components.css';

const TOOLS = [
  { icon: MessageSquare, title: 'AI Chat', desc: 'Ngobrol dengan AzryAI secara real-time.', to: '/chat', accent: 'cyan' },
  { icon: ImageIcon, title: 'Image Generator', desc: 'Ubah teks menjadi visual.', to: '/image-generator', accent: 'violet' },
  { icon: Mic, title: 'Voice Assistant', desc: 'Bicara langsung, biarkan AzryAI mendengar.', to: '/voice-assistant', accent: 'pink' },
  { icon: Search, title: 'Smart Search', desc: 'Cari jawaban cepat dan akurat.', to: '/chat?tool=search', accent: 'cyan' },
  { icon: Code2, title: 'Code Assistant', desc: 'Debug, refactor, dan tulis kode.', to: '/chat?tool=code', accent: 'violet' },
  { icon: Calculator, title: 'Math Solver', desc: 'Selesaikan soal matematika langkah-demi-langkah.', to: '/chat?tool=math', accent: 'pink' },
  { icon: Languages, title: 'Translator', desc: 'Terjemahkan ke berbagai bahasa.', to: '/chat?tool=translate', accent: 'cyan' },
  { icon: FileText, title: 'Summarizer', desc: 'Ringkas dokumen panjang dalam sekejap.', to: '/chat?tool=summarize', accent: 'violet' },
  { icon: CalendarClock, title: 'AI Planner', desc: 'Susun rencana dan jadwal harianmu.', to: '/chat?tool=planner', accent: 'pink' }
];

export default function Dashboard() {
  const { conversations } = useChat();
  const recent = conversations.slice(0, 4);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 11) return 'Selamat pagi';
    if (h < 15) return 'Selamat siang';
    if (h < 19) return 'Selamat sore';
    return 'Selamat malam';
  }, []);

  return (
    <div className="page-container">
      <div
        className="glass"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '22px 24px',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <span className="eyebrow">{greeting}</span>
          <h1 style={{ fontSize: 26, marginTop: 8 }}>Halo, Azry User 👋</h1>
          <p className="text-muted" style={{ marginTop: 6, maxWidth: 360, fontSize: 13.5 }}>
            Mau mulai dari mana hari ini? AzryAI siap bantu chat, cari, atau bikin sesuatu yang baru.
          </p>
          <Link to="/chat" className="btn btn-primary" style={{ marginTop: 16 }}>
            <MessageSquare size={16} /> Mulai Percakapan
          </Link>
        </div>
        <RobotMascot state="idle" size={132} showStatus={false} />
      </div>

      <div className="section-head">
        <h2>Quick actions</h2>
      </div>
      <div className="quick-actions">
        {TOOLS.slice(0, 6).map((t) => (
          <Link key={t.title} to={t.to} className="quick-action-chip">
            <t.icon size={14} /> {t.title}
          </Link>
        ))}
      </div>

      <div className="section-head">
        <h2>Recent chats</h2>
        <Link to="/history">Lihat semua</Link>
      </div>
      {recent.length === 0 ? (
        <div className="glass-panel" style={{ padding: 20, fontSize: 13.5, color: 'var(--text-mid)' }}>
          Belum ada percakapan. Mulai chat pertamamu sekarang.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recent.map((c) => (
            <Link
              key={c.id}
              to="/chat"
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                fontSize: 13.5
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                {c.title || 'Percakapan baru'}
              </span>
              <ArrowRight size={15} color="var(--text-low)" />
            </Link>
          ))}
        </div>
      )}

      <div className="section-head">
        <h2>Tools</h2>
        <Link to="/tools">Semua tools</Link>
      </div>
      <div className="tools-grid">
        {TOOLS.slice(0, 6).map((t) => (
          <ToolCard key={t.title} {...t} />
        ))}
      </div>
    </div>
  );
}
