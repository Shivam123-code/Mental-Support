'use client';

// Direct messaging between a client and their professional.
//
// History and sending go over REST, which owns the access rule and the write.
// Live delivery arrives on the socket the app already holds open. The socket is
// only a delivery shortcut: everything it carries is already persisted, so a
// socket that is down costs freshness, never a message.

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { Send, MessageSquare } from 'lucide-react';

interface Thread {
  userId: string;
  name: string;
  role: string | null;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

interface Msg {
  id: string;
  content: string;
  mine: boolean;
  isRead: boolean;
  createdAt: string;
}

export default function Chat({ initialWith }: { initialWith?: string }) {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(initialWith ?? null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [participant, setParticipant] = useState<{ id: string; name: string } | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToken(typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
  }, [user?.id]);

  const { socket } = useSocket(user?.id, user?.role, token || undefined, !!token && !!user?.id);
  const headers = useCallback(
    () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }),
    [token]
  );

  const loadThreads = useCallback(async () => {
    if (!token) return;
    try {
      const data = await (await fetch('/api/messages', { headers: headers() })).json();
      if (data.success) setThreads(data.data.items || []);
    } catch { /* the empty state covers it */ }
    finally { setLoading(false); }
  }, [token, headers]);

  const loadConversation = useCallback(async (withId: string) => {
    if (!token) return;
    try {
      const data = await (await fetch(`/api/messages?with=${withId}`, { headers: headers() })).json();
      if (data.success) {
        setMessages(data.data.items || []);
        setParticipant(data.data.participant);
        // Opening a thread clears its unread badge; the server has just marked
        // those messages read.
        setThreads(prev => prev.map(t => (t.userId === withId ? { ...t, unread: 0 } : t)));
      }
    } catch { /* keep whatever is on screen */ }
  }, [token, headers]);

  useEffect(() => { loadThreads(); }, [loadThreads]);
  useEffect(() => { if (activeId) loadConversation(activeId); }, [activeId, loadConversation]);

  // ── Live delivery ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;
    const onIncoming = (m: any) => {
      // Append only when the thread it belongs to is open, otherwise just bump
      // the list — appending someone else's message to the visible conversation
      // would show it under the wrong name.
      if (m.from && m.from === activeId) {
        setMessages(prev => (prev.some(x => x.id === m.id) ? prev : [...prev, { ...m, mine: false }]));
      }
      loadThreads();
    };
    const onSentElsewhere = (m: any) => {
      if (m.to && m.to === activeId) {
        setMessages(prev => (prev.some(x => x.id === m.id) ? prev : [...prev, { ...m, mine: true }]));
      }
    };
    socket.on('message:new', onIncoming);
    socket.on('message:sent', onSentElsewhere);
    return () => {
      socket.off('message:new', onIncoming);
      socket.off('message:sent', onSentElsewhere);
    };
  }, [socket, activeId, loadThreads]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || !activeId || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST', headers: headers(), body: JSON.stringify({ to: activeId, content }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Could not send');
      // Only clear the box once it has actually gone; otherwise a failed send
      // loses what the person typed.
      setDraft('');
      setMessages(prev => (prev.some(x => x.id === data.data.id) ? prev : [...prev, data.data]));
      loadThreads();
    } catch (err: any) {
      setError(err?.message ?? 'Could not send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-4 h-[28rem]">
      {/* Threads */}
      <div className="border border-slate-200 rounded-2xl overflow-y-auto bg-white">
        {loading && <p className="text-xs text-slate-400 p-4">Loading…</p>}
        {!loading && threads.length === 0 && (
          <p className="text-xs text-slate-400 p-4 leading-relaxed">
            No conversations yet. A thread opens once you have a session booked together.
          </p>
        )}
        {threads.map(t => (
          <button
            key={t.userId}
            onClick={() => setActiveId(t.userId)}
            className={`w-full text-left p-3 border-b border-slate-100 hover:bg-slate-50 transition ${
              activeId === t.userId ? 'bg-slate-50' : ''
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-bold truncate">{t.name}</span>
              {t.unread > 0 && (
                <span className="text-[9px] font-bold bg-rose-500 text-white rounded-full px-1.5 shrink-0">{t.unread}</span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{t.lastMessage}</p>
          </button>
        ))}
      </div>

      {/* Conversation */}
      <div className="border border-slate-200 rounded-2xl flex flex-col bg-white min-w-0">
        {!activeId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
            <MessageSquare size={28} />
            <p className="text-xs">Choose a conversation</p>
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-slate-100 shrink-0">
              <p className="text-xs font-bold">{participant?.name ?? 'Conversation'}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-8">No messages yet. Say hello.</p>
              )}
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed break-words whitespace-pre-wrap ${
                    m.mine ? 'bg-[var(--primary)] text-white' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {m.content}
                    <span className={`block text-[9px] mt-1 ${m.mine ? 'text-white/70' : 'text-slate-400'}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {error && <p className="text-[10px] text-rose-600 px-3 pb-1">{error}</p>}

            <form onSubmit={send} className="p-3 border-t border-slate-100 flex gap-2 shrink-0">
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Write a message…"
                maxLength={4000}
                className="flex-1 text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[var(--primary)] min-w-0"
              />
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="px-3.5 bg-[var(--primary)] text-white rounded-xl disabled:opacity-40 shrink-0"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
