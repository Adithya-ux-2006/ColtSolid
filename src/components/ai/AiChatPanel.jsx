import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUp, Sparkles, X } from 'lucide-react';
import { getApiUrl } from '../../utils/api';
import { cn } from '../../utils/cn';

const HISTORY_KEY = 'cs_ai_chat_history';
const PULSE_KEY = 'cs_ai_chat_pulse_seen';
const HIDDEN_PATHS = new Set(['/', '/login', '/register', '/onboarding']);
const QUICK_STARTS = [
  { label: "Can't sleep", text: "Can't sleep" },
  { label: 'Head is pounding', text: 'Head is pounding' },
  { label: 'Feeling anxious', text: 'Feeling anxious' },
  { label: 'Stomach issues', text: 'Stomach issues' },
];

function readHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function renderMarkdown(text, closePanel) {
  const lines = text.split('\n');

  return lines.map((line, index) => {
    const linkMatch = line.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      return (
        <Link
          key={`${line}-${index}`}
          to={linkMatch[2]}
          onClick={closePanel}
          className="mt-2 inline-flex rounded-full bg-sage/20 px-3 py-1.5 text-sm font-semibold text-forest hover:bg-sage/30"
        >
          {linkMatch[1]}
        </Link>
      );
    }

    const content = line.replace(/^[-*]\s*/, '• ');
    const parts = content.split(/(\*\*.+?\*\*)/g).filter(Boolean);

    return (
      <p key={`${line}-${index}`} className={cn(content.startsWith('• ') ? 'pl-2' : '', line.trim() ? 'mt-1' : 'mt-3')}>
        {parts.map((part, partIndex) => part.startsWith('**') && part.endsWith('**') ? (
          <strong key={partIndex}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={partIndex}>{part}</span>
        ))}
      </p>
    );
  });
}

export function AiChatPanel() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(readHistory);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(PULSE_KEY) !== 'true'
  );
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const isHidden = HIDDEN_PATHS.has(location.pathname);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('cs-open-ai-chat', open);
    return () => window.removeEventListener('cs-open-ai-chat', open);
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (!shouldPulse) return;
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(PULSE_KEY, 'true');
      setShouldPulse(false);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [shouldPulse]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`;
  }, [input]);

  if (isHidden) return null;

  const closePanel = () => setIsOpen(false);

  const sendMessage = async (text = input) => {
    const content = text.trim();
    if (!content || isLoading) return;

    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/ai-chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to answer right now.');
      setMessages([...nextMessages, { role: 'assistant', content: payload.reply }]);
    } catch (error) {
      setMessages([
        ...nextMessages,
        { role: 'assistant', content: error.message || 'I could not answer right now. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="AI Health Assistant"
        className={cn(
          'fixed bottom-24 right-4 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-coral text-white shadow-xl transition-transform hover:scale-105 hover:bg-coral-dark',
          shouldPulse ? 'animate-pulse' : ''
        )}
      >
        <Sparkles className="h-6 w-6" />
        {messages.length > 0 ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-green-400 ring-2 ring-white" /> : null}
      </button>

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-[60] flex w-full flex-col bg-cream shadow-2xl transition-transform duration-300 sm:w-[360px]',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="bg-coral px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-lg font-bold">
                <Sparkles className="h-5 w-5" />
                AI Health Assistant
              </div>
              <p className="mt-1 text-sm text-white/80">Describe how you feel</p>
            </div>
            <button type="button" onClick={closePanel} className="rounded-full p-1 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
          {messages.length === 0 ? (
            <div className="rounded-3xl bg-white p-4 text-sm leading-relaxed text-ink shadow-card">
              <p className="font-bold">✨ Hi! I'm your health assistant</p>
              <p className="mt-3">Describe how you're feeling and I'll suggest evidence-based remedies from our database.</p>
              <p className="mt-4 font-semibold">Quick starts:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_STARTS.map((quickStart) => (
                  <button
                    key={quickStart.text}
                    type="button"
                    onClick={() => sendMessage(quickStart.text)}
                    className="rounded-full bg-sage/20 px-3 py-1.5 text-sm font-semibold text-forest hover:bg-sage/30"
                  >
                    {quickStart.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'max-w-[80%] rounded-2xl rounded-tr-sm bg-coral px-4 py-3 text-white'
                      : 'max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-ink shadow-card'
                  )}
                >
                  {message.role === 'assistant' ? renderMarkdown(message.content, closePanel) : message.content}
                </div>
              </div>
            ))}
            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-ink shadow-card">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-coral" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-coral [animation-delay:120ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-coral [animation-delay:240ms]" />
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white p-3">
          <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-cream px-3 py-2 focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              placeholder="Describe your symptoms..."
              className="max-h-24 flex-1 resize-none bg-transparent py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral text-white transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
