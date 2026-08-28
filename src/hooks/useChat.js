import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'azryai_conversations';

function loadConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function newId() {
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Memanggil backend sendiri (bukan provider AI langsung).
 * Backend (/api/ai) yang menyimpan SYLVATICA_API_KEY dan meneruskan ke
 * https://sylvatica.my.id/api/ai/cloude.
 */
async function askAI(question, files = '') {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: question, files })
  });

  let payload;
  try {
    payload = await res.json();
  } catch {
    throw new Error('Respons server tidak valid. Silakan coba lagi.');
  }

  if (!res.ok) {
    throw new Error(payload?.error || 'Terjadi kesalahan saat menghubungi AI.');
  }

  return payload.result;
}

export function useChat() {
  const [conversations, setConversations] = useState(loadConversations);
  const [activeId, setActiveId] = useState(() => conversations[0]?.id ?? null);
  const [status, setStatus] = useState('idle'); // idle | thinking | responding | error

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const active = conversations.find((c) => c.id === activeId) || null;

  const startNewChat = useCallback(() => {
    const conv = {
      id: newId(),
      title: 'Percakapan baru',
      createdAt: Date.now(),
      messages: []
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    return conv.id;
  }, []);

  const deleteConversation = useCallback((id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;

      let convId = activeId;
      let base = conversations;

      if (!convId) {
        const conv = { id: newId(), title: text.slice(0, 40), createdAt: Date.now(), messages: [] };
        base = [conv, ...conversations];
        convId = conv.id;
        setActiveId(convId);
      }

      const userMsg = { id: newId(), role: 'user', content: text, ts: Date.now() };

      setConversations((prevList) => {
        const list = prevList.some((c) => c.id === convId) ? prevList : base;
        return list.map((c) =>
          c.id === convId
            ? {
                ...c,
                title: c.messages.length === 0 ? text.slice(0, 40) : c.title,
                messages: [...c.messages, userMsg]
              }
            : c
        );
      });

      setStatus('thinking');

      try {
        const result = await askAI(text);
        setStatus('responding');

        const aiMsg = { id: newId(), role: 'assistant', content: result, ts: Date.now() };
        setConversations((prevList) =>
          prevList.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, aiMsg] } : c))
        );

        setTimeout(() => setStatus('idle'), 600);
        return aiMsg;
      } catch (err) {
        const errMsg = {
          id: newId(),
          role: 'assistant',
          error: true,
          content: err.message || 'AI sedang tidak bisa dihubungi. Coba lagi ya.',
          ts: Date.now()
        };
        setConversations((prevList) =>
          prevList.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, errMsg] } : c))
        );
        setStatus('error');
        setTimeout(() => setStatus('idle'), 800);
        throw err;
      }
    },
    [activeId, conversations]
  );

  const regenerate = useCallback(
    async (conversationId) => {
      const conv = conversations.find((c) => c.id === conversationId);
      if (!conv) return;
      const lastUser = [...conv.messages].reverse().find((m) => m.role === 'user');
      if (!lastUser) return;

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, messages: c.messages.filter((m, i) => !(i === c.messages.length - 1 && m.role === 'assistant')) }
            : c
        )
      );
      setActiveId(conversationId);
      setStatus('thinking');
      try {
        const result = await askAI(lastUser.content);
        setStatus('responding');
        const aiMsg = { id: newId(), role: 'assistant', content: result, ts: Date.now() };
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, messages: [...c.messages, aiMsg] } : c))
        );
        setTimeout(() => setStatus('idle'), 600);
      } catch (err) {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 800);
      }
    },
    [conversations]
  );

  return {
    conversations,
    active,
    activeId,
    setActiveId,
    status,
    startNewChat,
    deleteConversation,
    sendMessage,
    regenerate
  };
                                                                        }
