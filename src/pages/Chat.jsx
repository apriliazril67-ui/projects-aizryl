import { useEffect, useRef, useState } from 'react';
import { Plus, Send, Mic, Paperclip, PanelLeft, X, Trash2 } from 'lucide-react';
import RobotMascot from '../components/RobotMascot.jsx';
import ChatMessage from '../components/ChatMessage.jsx';
import { useChat } from '../hooks/useChat.js';
import '../styles/chat.css';

const SUGGESTIONS = [
  'Jelaskan apa itu AI dengan bahasa sederhana',
  'Bantu aku menulis email profesional',
  'Buatkan rencana belajar 7 hari',
  'Perbaiki kode JavaScript ini'
];

export default function Chat() {
  const {
    conversations,
    active,
    activeId,
    setActiveId,
    status,
    startNewChat,
    deleteConversation,
    sendMessage,
    regenerate
  } = useChat();

  const [input, setInput] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachedFile, setAttachedFile] = useState(null);

  const messages = active?.messages ?? [];
  const robotState = status === 'thinking' ? 'thinking' : status === 'responding' ? 'responding' : 'idle';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, status]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || status === 'thinking') return;
    setInput('');
    setAttachedFile(null);
    try {
      await sendMessage(text);
    } catch {
      /* error message already appended in hook */
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser ini belum mendukung input suara. Coba gunakan Chrome terbaru.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.start();
  };

  const handleAttach = (e) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file.name);
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-icon" onClick={() => setHistoryOpen(true)} type="button" aria-label="Buka riwayat chat">
            <PanelLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: 16 }}>{active?.title || 'Percakapan baru'}</h2>
            <span style={{ fontSize: 11.5, color: 'var(--text-low)' }}>AzryAI · online</span>
          </div>
        </div>
        <button className="btn btn-ghost new-chat-btn" onClick={startNewChat} type="button">
          <Plus size={16} /> New Chat
        </button>
      </div>

      <div className="chat-scroll" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="chat-empty fade-in">
            <RobotMascot state={robotState} size={140} />
            <h2 style={{ fontSize: 19 }}>Ada yang bisa AzryAI bantu?</h2>
            <p className="text-muted" style={{ fontSize: 13.5, maxWidth: 360 }}>
              Tanyakan apa saja — dari ide, kode, sampai rencana harianmu.
            </p>
            <div className="suggestion-grid">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="glass-panel suggestion-chip" onClick={() => setInput(s)} type="button">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <ChatMessage
                key={m.id}
                message={m}
                canRegenerate={m.role === 'assistant' && i === messages.length - 1}
                onRegenerate={() => regenerate(activeId)}
              />
            ))}
            {status === 'thinking' && (
              <div className="msg-row assistant fade-in">
                <div className="msg-avatar">Az</div>
                <div className="msg-bubble">
                  <span className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="chat-input-bar">
        {attachedFile && (
          <div
            style={{
              maxWidth: 820,
              margin: '0 auto 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: 'var(--text-mid)'
            }}
          >
            <Paperclip size={13} /> {attachedFile}
            <button onClick={() => setAttachedFile(null)} type="button" style={{ background: 'none', border: 'none', color: 'var(--text-low)' }}>
              <X size={13} />
            </button>
          </div>
        )}
        <div className="chat-input-shell glass">
          <button className="btn-icon" type="button" onClick={() => fileInputRef.current?.click()} aria-label="Lampirkan file">
            <Paperclip size={17} />
          </button>
          <input ref={fileInputRef} type="file" hidden onChange={handleAttach} />
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pesan untuk AzryAI…"
            rows={1}
          />
          <div className="chat-input-actions">
            <button className="btn-icon" type="button" onClick={handleMic} aria-label="Input suara">
              <Mic size={17} />
            </button>
            <button
              className="btn-icon"
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || status === 'thinking'}
              style={{
                background: 'var(--gradient-brand)',
                color: '#04121a',
                borderColor: 'transparent',
                opacity: !input.trim() || status === 'thinking' ? 0.5 : 1
              }}
              aria-label="Kirim pesan"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
        <p className="chat-input-hint">Enter untuk kirim · Shift + Enter untuk baris baru</p>
      </div>

      {historyOpen && (
        <HistoryDrawer
          conversations={conversations}
          activeId={activeId}
          onSelect={(id) => {
            setActiveId(id);
            setHistoryOpen(false);
          }}
          onNew={() => {
            startNewChat();
            setHistoryOpen(false);
          }}
          onDelete={deleteConversation}
          onClose={() => setHistoryOpen(false)}
        />
      )}
    </div>
  );
}

function HistoryDrawer({ conversations, activeId, onSelect, onNew, onDelete, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(3,2,10,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="glass fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          left: 12,
          top: 12,
          bottom: 12,
          width: 280,
          maxWidth: '82vw',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15 }}>Chat history</h3>
          <button className="btn-icon" onClick={onClose} type="button" aria-label="Tutup">
            <X size={16} />
          </button>
        </div>
        <button className="btn btn-primary" onClick={onNew} type="button">
          <Plus size={16} /> New Chat
        </button>
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
          {conversations.length === 0 && (
            <p className="text-low" style={{ fontSize: 12.5, padding: '8px 4px' }}>Belum ada riwayat.</p>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
                padding: '10px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 13,
                background: c.id === activeId ? 'rgba(57,246,255,0.1)' : 'transparent',
                color: c.id === activeId ? 'var(--cyan)' : 'var(--text-mid)'
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--text-low)', flexShrink: 0 }}
                aria-label="Hapus percakapan"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
