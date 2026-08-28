import { useNavigate } from 'react-router-dom';
import { MessageSquare, Trash2, ArrowRight } from 'lucide-react';
import { useChat } from '../hooks/useChat.js';

export default function History() {
  const { conversations, setActiveId, deleteConversation } = useChat();
  const navigate = useNavigate();

  const open = (id) => {
    setActiveId(id);
    navigate('/chat');
  };

  return (
    <div className="page-container">
      <span className="eyebrow">Riwayat</span>
      <h1 style={{ fontSize: 26, marginTop: 10, marginBottom: 20 }}>Semua percakapan</h1>

      {conversations.length === 0 ? (
        <div className="glass-panel" style={{ padding: 28, textAlign: 'center' }}>
          <MessageSquare size={26} color="var(--cyan)" style={{ marginBottom: 10 }} />
          <p className="text-muted" style={{ fontSize: 13.5 }}>Belum ada percakapan tersimpan.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {conversations.map((c) => (
            <div
              key={c.id}
              className="glass-panel"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', cursor: 'pointer' }}
              onClick={() => open(c.id)}
            >
              <div className="msg-avatar" style={{ borderRadius: 10 }}>Az</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-low)' }}>
                  {c.messages.length} pesan · {new Date(c.createdAt).toLocaleDateString('id-ID')}
                </div>
              </div>
              <button
                className="btn-icon"
                type="button"
                onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}
                aria-label="Hapus"
              >
                <Trash2 size={15} />
              </button>
              <ArrowRight size={16} color="var(--text-low)" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
