import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, MessageSquare, Mail, User } from 'lucide-react';
import { useChat } from '../hooks/useChat.js';

export default function Profile() {
  const { conversations } = useChat();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Placeholder — hubungkan ke sistem auth sungguhan saat backend auth tersedia.
    if (confirm('Yakin ingin logout dari AzryAI?')) {
      navigate('/');
    }
  };

  return (
    <div className="page-container">
      <span className="eyebrow">Profile</span>

      <div className="glass" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 700,
            color: '#04121a',
            flexShrink: 0
          }}
        >
          A
        </div>
        <div>
          <h1 style={{ fontSize: 20 }}>Azry User</h1>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>Member sejak 2026</p>
        </div>
      </div>

      <div className="tools-grid" style={{ marginTop: 20 }}>
        <div className="glass-panel stat-card">
          <div className="value">{conversations.length}</div>
          <div className="label">Total percakapan</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="value">9</div>
          <div className="label">Tools tersedia</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="value">24/7</div>
          <div className="label">Siap membantu</div>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: 20, overflow: 'hidden' }}>
        <InfoRow icon={User} label="Username" value="azryuser" />
        <InfoRow icon={Mail} label="Email" value="azry.user@example.com" />
        <InfoRow icon={MessageSquare} label="Total percakapan" value={String(conversations.length)} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        <Link to="/settings" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
          <Settings size={17} /> Settings
        </Link>
        <button className="btn btn-ghost" onClick={handleLogout} type="button" style={{ justifyContent: 'flex-start', color: '#ffb3b3' }}>
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="settings-row">
      <div className="settings-row-label">
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={14} color="var(--cyan)" /> {label}
        </span>
      </div>
      <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>{value}</span>
    </div>
  );
}
