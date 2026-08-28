import {
  MessageSquare,
  ImageIcon,
  Mic,
  Search,
  Code2,
  Calculator,
  Languages,
  FileText,
  CalendarClock
} from 'lucide-react';
import ToolCard from '../components/ToolCard.jsx';
import '../styles/components.css';

const TOOLS = [
  { icon: MessageSquare, title: 'AI Chat', desc: 'Ngobrol dengan AzryAI secara real-time, dukung markdown & kode.', to: '/chat', accent: 'cyan' },
  { icon: ImageIcon, title: 'Image Generator', desc: 'Buat visual dari deskripsi teks dengan berbagai gaya.', to: '/image-generator', accent: 'violet' },
  { icon: Mic, title: 'Voice Assistant', desc: 'Bicara langsung dan dapatkan jawaban dari AzryAI.', to: '/voice-assistant', accent: 'pink' },
  { icon: Search, title: 'Smart Search', desc: 'Cari jawaban cepat, ringkas, dan relevan.', to: '/chat?tool=search', accent: 'cyan' },
  { icon: Code2, title: 'Code Assistant', desc: 'Tulis, debug, dan refactor kode di berbagai bahasa.', to: '/chat?tool=code', accent: 'violet' },
  { icon: Calculator, title: 'Math Solver', desc: 'Selesaikan soal matematika lengkap dengan langkahnya.', to: '/chat?tool=math', accent: 'pink' },
  { icon: Languages, title: 'Translator', desc: 'Terjemahkan teks ke puluhan bahasa secara instan.', to: '/chat?tool=translate', accent: 'cyan' },
  { icon: FileText, title: 'Summarizer', desc: 'Ringkas artikel atau dokumen panjang jadi poin penting.', to: '/chat?tool=summarize', accent: 'violet' },
  { icon: CalendarClock, title: 'AI Planner', desc: 'Susun rencana, jadwal, dan target harianmu.', to: '/chat?tool=planner', accent: 'pink' }
];

export default function Tools() {
  return (
    <div className="page-container">
      <span className="eyebrow">Semua Tools</span>
      <h1 style={{ fontSize: 26, marginTop: 10, marginBottom: 4 }}>Pilih tool AzryAI</h1>
      <p className="text-muted" style={{ fontSize: 13.5, marginBottom: 24 }}>
        Sembilan kemampuan inti, satu companion.
      </p>

      <div className="tools-grid">
        {TOOLS.map((t) => (
          <ToolCard key={t.title} {...t} />
        ))}
      </div>
    </div>
  );
}
