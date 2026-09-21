import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { apiFetch } from '../lib/apiClient';
import { useAuth } from '../hooks/useAuth';

export default function DiscussionThread({ problemId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  const loadMessages = () => {
    setIsLoading(true);
    apiFetch(`/discussions/problem/${problemId}`)
      .then((res) => setMessages(res.data || []))
      .catch((err) => setError(err.message || 'Could not load discussion'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (problemId) loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setIsSending(true);
    setError('');
    try {
      const res = await apiFetch('/discussions', {
        method: 'POST',
        body: JSON.stringify({ problem_id: problemId, message: text }),
      });
      setMessages((prev) => [...prev, res.data]);
      setDraft('');
    } catch (err) {
      setError(err.message || 'Message failed to send');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80 flex flex-col">
      <h3 className="text-base font-bold text-slate-900 mb-1 pb-2 border-b border-slate-100 flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-[#006199]" />
        <span>Discussion</span>
      </h3>
      <p className="text-[11px] text-slate-500 mb-4">
        Open to citizens, universities, industry, and government — share insights or ask questions.
      </p>

      <div ref={scrollRef} className="flex-1 max-h-96 overflow-y-auto space-y-3 pr-1 mb-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-slate-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Loading discussion...
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400">
            No messages yet — be the first to share an insight.
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isOwn = msg.user_id === user?.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs ${
                    isOwn
                      ? 'bg-[#006199] text-white rounded-br-sm'
                      : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-bl-sm'
                  }`}
                >
                  {!isOwn && (
                    <p className="text-[10px] font-bold text-[#006199] mb-0.5">
                      Participant {msg.user_id?.slice(0, 6)}
                    </p>
                  )}
                  <p className="leading-relaxed">{msg.message}</p>
                  <p className={`text-[9px] mt-1 ${isOwn ? 'text-white/60' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Share an insight or ask a question..."
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#006199] focus:ring-2 focus:ring-[#006199]/20 transition-all"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSending || !draft.trim()}
          className="p-2.5 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </motion.button>
      </form>
    </div>
  );
}