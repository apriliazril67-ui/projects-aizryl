import { useState } from 'react';
import { marked } from 'marked';
import { Copy, Check, RotateCcw } from 'lucide-react';

marked.setOptions({ breaks: true, gfm: true });

// Sanitasi ringan agar tidak menyuntikkan tag berbahaya dari respons AI.
function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/ on\w+="[^"]*"/gi, '')
    .replace(/ on\w+='[^']*'/gi, '');
}

export default function ChatMessage({ message, onRegenerate, canRegenerate }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore silently */
    }
  };

  const html = !isUser ? sanitizeHtml(marked.parse(message.content || '')) : null;

  return (
    <div className={`msg-row ${isUser ? 'user' : 'assistant'} fade-in`}>
      {!isUser && <div className="msg-avatar">Az</div>}
      <div>
        <div className={`msg-bubble ${message.error ? 'error' : ''}`}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
        {!isUser && !message.error && (
          <div className="msg-actions">
            <button onClick={handleCopy} type="button">
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Tersalin' : 'Salin'}
            </button>
            {canRegenerate && (
              <button onClick={onRegenerate} type="button">
                <RotateCcw size={13} /> Regenerasi
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
