import { useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import RobotMascot from '../components/RobotMascot.jsx';

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [robotState, setRobotState] = useState('idle');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const askBackend = async (text) => {
    setRobotState('thinking');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, files: '' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI tidak merespons.');
      setReply(data.result);
      setRobotState('responding');
      setTimeout(() => setRobotState('idle'), 1500);

      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(data.result.replace(/[#*`_>-]/g, ''));
        utter.lang = 'id-ID';
        window.speechSynthesis.speak(utter);
      }
    } catch (err) {
      setError(err.message);
      setRobotState('idle');
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Browser ini belum mendukung input suara. Coba gunakan Chrome terbaru.');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    setError('');
    setTranscript('');
    setReply('');
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const text = Array.from(e.results).map((r) => r[0].transcript).join(' ');
      setTranscript(text);
    };
    recognition.onend = () => {
      setListening(false);
      setTranscript((current) => {
        if (current.trim()) askBackend(current.trim());
        return current;
      });
    };
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20, paddingTop: 30 }}>
      <span className="eyebrow">Voice Assistant</span>
      <RobotMascot state={robotState} size={170} />

      <button
        type="button"
        onClick={toggleListening}
        aria-label={listening ? 'Berhenti mendengarkan' : 'Mulai bicara'}
        style={{
          width: 84,
          height: 84,
          borderRadius: '50%',
          border: 'none',
          background: listening ? 'linear-gradient(135deg,#ff5fd1,#8b5cf6)' : 'var(--gradient-brand)',
          color: '#04121a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: listening ? '0 0 40px rgba(255,95,209,0.5)' : '0 0 30px rgba(57,246,255,0.35)',
          transition: 'all 0.2s ease'
        }}
      >
        {listening ? <Square size={26} /> : <Mic size={26} />}
      </button>

      {listening && (
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 30 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 4,
                borderRadius: 4,
                background: 'var(--cyan)',
                animation: `waveBar 0.8s ease-in-out ${i * 0.08}s infinite`
              }}
            />
          ))}
          <style>{`
            @keyframes waveBar {
              0%, 100% { height: 6px; }
              50% { height: 28px; }
            }
          `}</style>
        </div>
      )}

      <p className="text-muted" style={{ fontSize: 13.5 }}>
        {listening ? 'Mendengarkan…' : 'Tekan tombol mic dan mulai bicara.'}
      </p>

      {transcript && (
        <div className="glass-panel" style={{ padding: 16, maxWidth: 480, width: '100%', fontSize: 13.5 }}>
          <span className="text-low" style={{ fontSize: 11, textTransform: 'uppercase' }}>Transkrip</span>
          <p style={{ marginTop: 6 }}>{transcript}</p>
        </div>
      )}

      {reply && (
        <div className="glass" style={{ padding: 18, maxWidth: 480, width: '100%', fontSize: 13.5, textAlign: 'left' }}>
          <span className="eyebrow">AzryAI</span>
          <p style={{ marginTop: 8, lineHeight: 1.6 }}>{reply}</p>
        </div>
      )}

      {error && <p style={{ fontSize: 12.5, color: '#ffb3b3' }}>{error}</p>}
    </div>
  );
}
