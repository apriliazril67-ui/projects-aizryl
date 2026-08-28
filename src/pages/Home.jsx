import { Link } from 'react-router-dom';
import { Sparkles, Compass, Zap, ShieldCheck, Rocket } from 'lucide-react';
import RobotMascot from '../components/RobotMascot.jsx';
import '../styles/galaxy.css';

export default function Home() {
  return (
    <div className="page-container">
      <div className="floating-planet" />

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 22,
          padding: '30px 0 10px'
        }}
      >
        <span className="eyebrow">AzryAI · 2030 Intelligence</span>

        <RobotMascot state="idle" size={190} />

        <div>
          <h1
            style={{
              fontSize: 'clamp(34px, 8vw, 58px)',
              fontWeight: 800,
              background: 'var(--gradient-brand)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1.05
            }}
          >
            AzryAI
          </h1>
          <p style={{ fontSize: 'clamp(15px, 3.4vw, 19px)', color: 'var(--text-mid)', marginTop: 10 }}>
            Your AI Companion of the Future
          </p>
          <p className="eyebrow" style={{ marginTop: 12, justifyContent: 'center' }}>
            Smart. Fast. Modern.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
          <Link to="/chat" className="btn btn-primary">
            <Sparkles size={17} /> Start Chat
          </Link>
          <Link to="/tools" className="btn btn-ghost">
            <Compass size={17} /> Explore AI
          </Link>
        </div>
      </section>

      <section className="tools-grid" style={{ marginTop: 42 }}>
        <HighlightCard
          icon={Zap}
          title="Respons Instan"
          desc="Ditenagai model AI cepat untuk percakapan, kode, hingga riset harian."
          accent="cyan"
        />
        <HighlightCard
          icon={Rocket}
          title="9 Tools Dalam Satu Genggaman"
          desc="Chat, gambar, suara, kode, hingga planner — semua terhubung dalam satu ruang."
          accent="violet"
        />
        <HighlightCard
          icon={ShieldCheck}
          title="Aman Sejak Desain"
          desc="Kunci API disimpan aman di server, tidak pernah tersimpan di perangkatmu."
          accent="pink"
        />
      </section>
    </div>
  );
}

function HighlightCard({ icon: Icon, title, desc, accent }) {
  return (
    <div className={`glass-panel tool-card accent-${accent}`} style={{ cursor: 'default' }}>
      <div className="tool-card-icon">
        <Icon size={20} />
      </div>
      <div className="tool-card-body">
        <h3>{title}</h3>
        <p className="text-muted">{desc}</p>
      </div>
    </div>
  );
}
