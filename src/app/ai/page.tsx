'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const CODE_SPAN =
  'font-mono text-[0.8em] bg-[var(--code-bg)] border border-[var(--border)] rounded px-1.5 py-0.5 break-all';

/* -------------------------------------------------------------------------- */
/* Providers — Puter.js is the default and needs no key.                        */
/* -------------------------------------------------------------------------- */

const PUTER_SCRIPT_SRC = 'https://js.puter.com/v2/';
const PUTER_MODEL = 'gpt-5.6-luna';
const FIRST_TOKEN_TIMEOUT_MS = 30_000;
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'openrouter/free';
const KEY_STORAGE_KEY = 'bloxd.free-ai.keys.v1';

const POPUP_HINT =
  'Puter signs you in through a popup window. If it never appeared, the browser blocked it — allow popups for this site and try again.';

const BLOXD_SYSTEM_PROMPT = [
  'You are the Bloxd.io scripting assistant inside Bloxd Utility — a code assistant that writes, explains and debugs Bloxd.io scripts.',
  '',
  'Output rules (mandatory):',
  '- Always return runnable code inside a fenced code block, tagged with its language (for example ```javascript). No untagged code, ever.',
  '- Ship complete, working code. Never leave placeholder stubs or TODO markers in place of real logic.',
  '- Keep prose outside the fenced block and short: what the code does and how to use it.',
  '- If a Bloxd.io API signature is uncertain, say so explicitly instead of inventing one.',
  '- Bloxd.io has no line comments: use /* block comments */. World Code runs exactly once when the lobby starts, and let/const declared there are invisible to Code Blocks — share state through globalThis.',
].join('\n');

type ChatTurn = { role: 'system' | 'user' | 'assistant'; content: string };

declare global {
  interface Window {
    puter?: {
      ai?: {
        chat: (
          messages: ChatTurn[],
          options?: { model?: string; stream?: boolean },
        ) => Promise<unknown>;
      };
    };
  }
}

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  provider?: string;
  error?: string;
};

type Segment =
  | { kind: 'text'; value: string }
  | { kind: 'code'; value: string; lang: string };

/** Splits a reply into prose and fenced code so code can be rendered and copied. */
function splitFences(raw: string): Segment[] {
  const segments: Segment[] = [];
  const fence = /```([A-Za-z0-9_+#.-]*)[ \t]*\r?\n([\s\S]*?)```/g;
  let cursor = 0;
  let match: RegExpExecArray | null = fence.exec(raw);
  while (match !== null) {
    if (match.index > cursor) {
      segments.push({ kind: 'text', value: raw.slice(cursor, match.index) });
    }
    segments.push({ kind: 'code', value: match[2].replace(/\s+$/, ''), lang: match[1] || 'text' });
    cursor = match.index + match[0].length;
    match = fence.exec(raw);
  }
  if (cursor < raw.length) segments.push({ kind: 'text', value: raw.slice(cursor) });
  return segments;
}

function readKey(): string {
  try {
    const raw = window.localStorage.getItem(KEY_STORAGE_KEY);
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return typeof parsed?.openrouter === 'string' ? parsed.openrouter.trim() : '';
  } catch {
    return '';
  }
}

function writeKey(value: string) {
  const existing = (() => {
    try {
      return JSON.parse(window.localStorage.getItem(KEY_STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  })();
  window.localStorage.setItem(
    KEY_STORAGE_KEY,
    JSON.stringify({ ...existing, openrouter: value.trim() }),
  );
}

/* Lazy, cached Puter.js injection — one script tag per session, hard timeout. */
let puterLoadPromise: Promise<Window['puter']> | null = null;

function loadPuter(timeoutMs: number = FIRST_TOKEN_TIMEOUT_MS): Promise<Window['puter']> {
  if (window.puter?.ai?.chat) return Promise.resolve(window.puter);
  if (puterLoadPromise) return puterLoadPromise;

  puterLoadPromise = new Promise<Window['puter']>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(POPUP_HINT)),
      timeoutMs,
    );
    const cleanup = () => clearTimeout(timer);
    const settle = () => {
      cleanup();
      if (window.puter?.ai?.chat) resolve(window.puter);
      else reject(new Error('Puter.js loaded but did not expose an AI API. ' + POPUP_HINT));
    };
    const failed = () => {
      cleanup();
      puterLoadPromise = null;
      reject(new Error('Could not load the Puter.js script. Check your connection and try again.'));
    };

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="' + PUTER_SCRIPT_SRC + '"]',
    );
    if (existing) {
      existing.addEventListener('load', settle);
      existing.addEventListener('error', failed);
      return;
    }
    const script = document.createElement('script');
    script.src = PUTER_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', settle);
    script.addEventListener('error', failed);
    document.head.appendChild(script);
  });

  return puterLoadPromise;
}

function completionText(res: unknown): string {
  if (typeof res === 'string') return res;
  if (!res || typeof res !== 'object') return '';
  const r = res as Record<string, any>;
  const candidates = [
    r.text,
    r.message?.text,
    r.message?.content,
    r.choices?.[0]?.message?.content,
    r.choices?.[0]?.text,
    r.content,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c;
  }
  return '';
}

/** Streams one Puter completion, gated by a 30s first-token budget. */
async function puterChat(
  messages: ChatTurn[],
  onDelta: (delta: string) => void,
  signal: AbortSignal,
): Promise<string> {
  const puter = await loadPuter();
  let firstToken = false;
  let cumulative = '';
  let emitted = '';

  const push = (delta: string) => {
    if (!delta) return;
    firstToken = true;
    emitted += delta;
    onDelta(delta);
  };

  const work = (async () => {
    const res: any = await puter!.ai!.chat(messages, { model: PUTER_MODEL, stream: true });
    if (res && typeof res.on === 'function') {
      await new Promise<void>((resolve, reject) => {
        res.on('data', (p: any) => {
          if (typeof p === 'string') push(p);
          else if (typeof p?.delta === 'string') push(p.delta);
          else if (typeof p?.text === 'string') {
            if (p.text.startsWith(cumulative)) push(p.text.slice(cumulative.length));
            else push(p.text);
            cumulative = p.text;
          }
        });
        res.on('error', (e: any) => reject(new Error(String(e?.message || e))));
        res.on('end', () => resolve());
        res.on('done', () => resolve());
      });
      return cumulative || emitted;
    }
    if (res && typeof res[Symbol.asyncIterator] === 'function') {
      for await (const chunk of res as AsyncIterable<any>) {
        const piece =
          typeof chunk === 'string'
            ? chunk
            : chunk?.delta ?? chunk?.text ?? completionText(chunk);
        if (typeof piece === 'string') push(piece);
      }
      return emitted;
    }
    let text = completionText(res);
    if (!text && res && typeof res.text === 'function') text = await Promise.resolve(res.text());
    if (text) push(text);
    return text || emitted;
  })();

  let timer: ReturnType<typeof setTimeout> | null = null;
  const budget = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(POPUP_HINT)),
      FIRST_TOKEN_TIMEOUT_MS,
    );
  });

  try {
    const finished = work.finally(() => {
      if (timer) clearTimeout(timer);
    });
    const raced = await Promise.race([finished, budget]);
    if (signal.aborted) throw new Error('Request cancelled.');
    return raced;
  } catch (err) {
    if (signal.aborted) throw new Error('Request cancelled.');
    const message = err instanceof Error ? err.message : String(err);
    if (!firstToken && /popup|sign.?in|AI API|script/i.test(message)) {
      throw new Error('Puter sent no output within 30s. ' + POPUP_HINT);
    }
    if (!firstToken) throw new Error('Puter sent no output within 30s.');
    throw new Error(message || 'Puter request failed.');
  }
}

/** OpenAI-compatible, non-streamed, same 30s budget. Key lives in the browser only. */
async function openRouterChat(
  messages: ChatTurn[],
  key: string,
  signal: AbortSignal,
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FIRST_TOKEN_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal.addEventListener('abort', onAbort, { once: true });

  try {
    const res = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + key,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      },
      body: JSON.stringify({ model: OPENROUTER_MODEL, messages, stream: false }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('OpenRouter responded with HTTP ' + res.status + '.');
    const data = await res.json();
    const text = completionText(data);
    if (!text) throw new Error('OpenRouter returned an empty answer.');
    return text;
  } catch (err) {
    if (signal.aborted) throw new Error('Request cancelled.');
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('OpenRouter sent no output within 30s.');
    }
    throw new Error(err instanceof Error ? err.message : 'OpenRouter request failed.');
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', onAbort);
  }
}

/* -------------------------------------------------------------------------- */

const starters = [
  'Write a World Code snippet that gives every joining player a diamond sword.',
  'Explain the delegator pattern for letting Code Blocks trigger callbacks.',
  'Build a QTE sequence where the player must press E within 1.5 seconds.',
  'Create a particle effect that fires when a mob dies.',
];

export default function AiPage() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedDark = localStorage.getItem('darkMode') === 'true';
    setIsDark(savedDark);
    document.documentElement.classList.toggle('dark', savedDark);
    setApiKey(readKey());
    setMounted(true);
  }, []);

  useEffect(() => {
    const node = logRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, busy]);

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('darkMode', String(newDark));
    document.documentElement.classList.toggle('dark', newDark);
  };

  const saveKey = (value: string) => {
    setApiKey(value);
    writeKey(value);
  };

  const copy = (value: string, tag: string) => {
    navigator.clipboard?.writeText(value).then(
      () => {
        setCopied(tag);
        setTimeout(() => setCopied(''), 1600);
      },
      () => undefined,
    );
  };

  const updateLastAssistant = useCallback((fn: (prev: Message) => Message) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.slice();
      next[next.length - 1] = fn(next[next.length - 1]);
      return next;
    });
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;

      const key = readKey();
      const userTurn: ChatTurn = { role: 'user', content: text };
      const history: ChatTurn[] = messages
        .filter((m) => !m.error && m.text.trim())
        .map((m) => ({ role: m.role, content: m.text }));

      const userMessage: Message = {
        id: 'u' + Date.now(),
        role: 'user',
        text,
      };
      const replyId = 'a' + Date.now();
      const reply: Message = { id: replyId, role: 'assistant', text: '' };

      setMessages((prev) => [...prev, userMessage, reply]);
      setInput('');
      setBusy(true);
      setStatus('Resolving provider chain…');

      const controller = new AbortController();
      abortRef.current = controller;

      const chain: Array<{ label: string; run: () => Promise<string> }> = [
        {
          label: 'Puter.js — free, no key needed',
          run: () => puterChat([{ role: 'system', content: BLOXD_SYSTEM_PROMPT }, ...history, userTurn], (delta) => {
            updateLastAssistant((prev) => (prev.id === replyId ? { ...prev, text: prev.text + delta } : prev));
          }, controller.signal),
        },
      ];
      if (key) {
        chain.push({
          label: 'OpenRouter — your own free key',
          run: () => openRouterChat([{ role: 'system', content: BLOXD_SYSTEM_PROMPT }, ...history, userTurn], key, controller.signal),
        });
      }

      const failures: string[] = [];

      for (const attempt of chain) {
        if (controller.signal.aborted) break;
        setStatus('Asking ' + attempt.label + '…');
        try {
          const answer = attempt.run();
          if (attempt.label.indexOf('Puter') === 0) {
            answer.then((full) => {
              updateLastAssistant((prev) =>
                prev.id === replyId && !prev.text ? { ...prev, text: full, provider: 'Puter.js' } : prev,
              );
            }, () => undefined);
          }
          const final = await answer;
          updateLastAssistant((prev) =>
            prev.id === replyId
              ? { ...prev, text: final, provider: attempt.label, error: '' }
              : prev,
          );
          setStatus('');
          setBusy(false);
          abortRef.current = null;
          return;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          failures.push(attempt.label + ': ' + message);
        }
      }

      updateLastAssistant((prev) =>
        prev.id === replyId
          ? {
              ...prev,
              provider: chain.length === 1 ? 'Puter.js' : 'Puter.js, then OpenRouter',
              error: failures.join('  —  '),
            }
          : prev,
      );
      setStatus('');
      setBusy(false);
      abortRef.current = null;
    },
    [busy, messages, updateLastAssistant],
  );

  const cancel = () => {
    abortRef.current?.abort();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <header className="border-b border-[var(--border)] bg-[var(--sidebar-bg)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Players Logo" className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tighter">Players</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/documentation" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">Documentation</Link>
              <Link href="/api" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">API Reference</Link>
              <Link href="/guides" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">Guides</Link>
              <Link href="/bloxdbench" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">BloxdBench</Link>
              <Link href="/ai" className="text-sm font-medium text-[var(--primary)] font-semibold">Bloxd AI</Link>
              <Link href="/platform" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">Platform</Link>
              <Link href="/changelog" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">Changelog</Link>
              <a href="https://bloxdutility.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">Main Website</a>
            </nav>
            <div className="flex items-center gap-4">
              <button onClick={toggleDark} className="p-2 rounded-lg bg-[var(--border)] hover:bg-[var(--nav-hover)] transition-colors" aria-label="Toggle dark mode">
                {isDark ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <Link href="/" className="text-sm text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors">Home</Link>
          <span className="text-sm text-[var(--text)]/40 mx-2">/</span>
          <span className="text-sm font-semibold text-[var(--text)]">Bloxd AI</span>
        </div>

        <section className="mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Live in your browser — Puter.js is the default, no key required
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Bloxd AI chat</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            A real chat against the Bloxd.io scripting assistant, running entirely in this page. The default provider is
            Puter.js, loaded lazily from <code className={CODE_SPAN}>{PUTER_SCRIPT_SRC}</code> and called through{' '}
            <code className={CODE_SPAN}>puter.ai.chat</code> with a 30-second first-token budget. Add your own free
            OpenRouter key and it becomes the second provider in the chain. There is no server in the middle and no key of
            ours on the backend.
          </p>
        </section>

        <section className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold">Conversation</h2>
              <div className="flex items-center gap-3">
                {status && <span className="text-xs font-semibold text-[var(--text)]/60">{status}</span>}
                {busy ? (
                  <button onClick={cancel} className="text-xs font-semibold text-red-500 hover:underline">Cancel</button>
                ) : null}
                <button onClick={() => setMessages([])} className="text-xs font-semibold text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors">
                  Clear
                </button>
              </div>
            </div>

            <div ref={logRef} className="h-[26rem] overflow-y-auto border border-[var(--border)] rounded-lg bg-[var(--bg)] p-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-[var(--text)]/70 mb-1 font-semibold">Ask for a Bloxd.io script.</p>
                  <p className="text-sm text-[var(--text)]/50 mb-4">Answers come back with a fenced code block you can copy.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                    {starters.map((starter) => (
                      <button
                        key={starter}
                        onClick={() => send(starter)}
                        className="text-left text-xs font-semibold px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) =>
                    message.role === 'user' ? (
                      <div key={message.id} className="flex justify-end">
                        <div className="max-w-[85%] rounded-xl rounded-br-sm bg-[var(--primary)] text-white px-4 py-2.5 text-sm whitespace-pre-wrap">
                          {message.text}
                        </div>
                      </div>
                    ) : (
                      <div key={message.id} className="flex justify-start">
                        <div className="max-w-[92%] rounded-xl rounded-bl-sm border border-[var(--border)] bg-[var(--sidebar-bg)] px-4 py-3 text-sm w-full">
                          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[var(--text)]/50">
                            <span className="text-emerald-500">Bloxd AI</span>
                            {message.provider && <span>· {message.provider}</span>}
                            {busy && !message.text && <span className="loading-icon">◐</span>}
                          </div>
                          {message.error && (
                            <div className="mb-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                              {message.error}
                            </div>
                          )}
                          {message.text && (
                            <div>
                              {splitFences(message.text).map((segment, index) =>
                                segment.kind === 'code' ? (
                                  <div key={index} className="code-block">
                                    <div className="code-toolbar">
                                      <span>{segment.lang}</span>
                                      <span className="code-actions">
                                        <button onClick={() => copy(segment.value, message.id + index)}>
                                          {copied === message.id + index ? 'Copied' : 'Copy'}
                                        </button>
                                      </span>
                                    </div>
                                    <pre className="p-3 overflow-x-auto text-xs leading-relaxed">
                                      <code>{segment.value}</code>
                                    </pre>
                                  </div>
                                ) : segment.value.trim() ? (
                                  <p key={index} className="whitespace-pre-wrap my-1.5 leading-relaxed">
                                    {segment.value.trim()}
                                  </p>
                                ) : null,
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                send(input);
              }}
              className="flex flex-col sm:flex-row gap-3 mt-4"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Write a Bloxd.io script that…"
                disabled={busy}
                className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm focus:border-[var(--primary)] outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={busy || !mounted || !input.trim()}
                className="px-6 py-2.5 rounded-lg bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-60"
              >
                {busy ? 'Sending…' : 'Send'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h2 className="text-lg font-bold mb-1">Provider chain</h2>
              <p className="text-sm text-[var(--text)]/70 mb-4">
                Resolved fresh on every message. Puter is always first; OpenRouter is added only when a key is saved.
              </p>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-emerald-500 pl-3">
                  <p className="font-semibold">1 — Puter.js</p>
                  <p className="text-[var(--text)]/70">Default. No account, no key. {PUTER_SCRIPT_SRC}</p>
                </div>
                <div className={`border-l-4 pl-3 ${apiKey ? 'border-blue-500' : 'border-[var(--border)]'}`}>
                  <p className="font-semibold">2 — OpenRouter</p>
                  <p className="text-[var(--text)]/70">
                    {apiKey ? 'Key saved in this browser — active in the chain.' : 'Inactive until you save a key below.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h2 className="text-lg font-bold mb-1">Your own key (optional)</h2>
              <p className="text-sm text-[var(--text)]/70 mb-3">
                A free OpenRouter key is used straight from the browser. It is stored in{' '}
                <code className={CODE_SPAN}>{KEY_STORAGE_KEY}</code>, read at call time, and sent to nobody but
                OpenRouter. There is no server-side key here.
              </p>
              <div className="flex gap-2">
                <input
                  value={apiKey}
                  onChange={(event) => saveKey(event.target.value)}
                  placeholder="sk-or-v1-…"
                  type={showKey ? 'text' : 'password'}
                  className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-xs font-mono focus:border-[var(--primary)] outline-none"
                />
                <button
                  onClick={() => setShowKey((prev) => !prev)}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold hover:border-[var(--primary)] transition-colors"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="flex gap-4 mt-3 text-xs font-semibold">
                <button onClick={() => saveKey('')} className="text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors">
                  Remove key
                </button>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:underline"
                >
                  Get a free key →
                </a>
              </div>
            </div>

            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h2 className="text-lg font-bold mb-1">System prompt</h2>
              <p className="text-sm text-[var(--text)]/70 mb-3">
                Every request is prefixed with the Bloxd.io scripting prompt, which is why answers arrive as a tagged fenced
                code block.
              </p>
              <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-3 overflow-x-auto font-mono text-[0.7rem] leading-relaxed whitespace-pre-wrap">
                {BLOXD_SYSTEM_PROMPT}
              </pre>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">How a message travels</h2>
          <ol className="space-y-4">
            {[
              {
                title: 'Prompt is prefixed',
                body: 'The conversation is rebuilt from state and prefixed with the Bloxd.io system prompt, so the model answers as a Bloxd.io assistant and always wraps runnable code in a tagged fence.',
              },
              {
                title: 'Puter.js is loaded lazily',
                body: 'The script is injected once per session from js.puter.com/v2, the promise is cached, and a hard 30s timer rejects with the popup message if it never exposes window.puter.',
              },
              {
                title: 'puter.ai.chat streams',
                body: 'The call runs with stream: true. Deltas, cumulative text, and done/end events are all normalised into appended text, so tokens appear as they arrive.',
              },
              {
                title: 'First token is gated at 30s',
                body: 'A silent stream is abandoned at 30 seconds rather than hanging. For Puter that is reported as a likely blocked sign-in popup with the fix in the message.',
              },
              {
                title: 'Your key is the fallback',
                body: 'If Puter fails and a key is saved, the same messages go to OpenRouter as a plain POST. Both failures are then listed together on the message.',
              },
              {
                title: 'Fences become code blocks',
                body: 'The reply is split on fenced blocks. Prose renders as text, each fenced block renders with its language label and a copy button.',
              },
            ].map((step, index) => (
              <li key={step.title} className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                    <p className="text-[var(--text)]/70">{step.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Code &amp; tech used</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 bg-[var(--table-header-bg)] border border-[var(--border)] text-sm font-bold">Part</th>
                  <th className="text-left px-4 py-2.5 bg-[var(--table-header-bg)] border border-[var(--border)] text-sm font-bold">Library / path / endpoint</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ['Route', 'src/app/ai/page.tsx (this documentation site)'],
                  ['Rendering', "'use client' — chat UI ships as client-only JavaScript"],
                  ['Default provider', 'Puter.js, lazily from ' + PUTER_SCRIPT_SRC],
                  ['Puter call', 'window.puter.ai.chat(messages, { model, stream: true })'],
                  ['Default Puter model', PUTER_MODEL],
                  ['First-token budget', 'FIRST_TOKEN_TIMEOUT_MS = ' + FIRST_TOKEN_TIMEOUT_MS / 1000 + 's'],
                  ['Fallback provider', OPENROUTER_ENDPOINT],
                  ['Fallback model', OPENROUTER_MODEL],
                  ['Key storage', 'localStorage → ' + KEY_STORAGE_KEY],
                  ['System prompt', 'BLOXD_SYSTEM_PROMPT (Bloxd.io scripting assistant)'],
                  ['Code display', 'splitFences() → prose segments + fenced blocks'],
                  ['Error model', 'per-provider messages collected and shown on the reply'],
                  ['Server keys', 'none — every request is made from the browser'],
                ] as Array<[string, string]>).map(([part, value]) => (
                  <tr key={part} className="hover:bg-[var(--nav-hover)] transition-colors">
                    <td className="px-4 py-2.5 border border-[var(--border)] text-sm font-semibold align-top">{part}</td>
                    <td className="px-4 py-2.5 border border-[var(--border)] text-sm align-top">
                      <code className={CODE_SPAN}>{value}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The whole chain in code</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            This is the shape you would copy into your own page. Nothing here needs a backend route.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed mb-4">
{`const puter = await loadPuter();                  // inject once, cache the promise
const answer = await Promise.race([
  puter.ai.chat(messages, { model: "${PUTER_MODEL}", stream: true }),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error(POPUP_HINT)), ${FIRST_TOKEN_TIMEOUT_MS})),
]);                                                  // 30s first-token gate

// fallback, only when a key is saved in localStorage
if (key) {
  await fetch("${OPENROUTER_ENDPOINT}", {
    method: "POST",
    headers: { Authorization: "Bearer " + key },
    body: JSON.stringify({ model: "${OPENROUTER_MODEL}", messages }),
  });
}

// fenced blocks become copyable code panels, prose stays prose
splitFences(answer).forEach(renderSegment);`}
          </pre>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed">
{`const BLOXD_SYSTEM_PROMPT = [
  "You are the Bloxd.io scripting assistant inside Bloxd Utility.",
  "Always return runnable code inside a fenced code block, tagged.",
  "Never leave placeholder stubs or TODO markers.",
  "If a Bloxd.io API signature is uncertain, say so explicitly.",
].join("\\n");`}
          </pre>
        </section>

        <section className="border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-bold mb-6">Try it</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="https://bloxdutility.netlify.app/bloxd-ai" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Bloxd AI</p>
              <p className="text-sm text-[var(--text)]/60">Main site /bloxd-ai</p>
            </a>
            <a href="https://bloxdutility.netlify.app/workspace" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">AI Workspace</p>
              <p className="text-sm text-[var(--text)]/60">Chat + editor + preview</p>
            </a>
            <a href="https://bloxdutility.netlify.app/lab" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Code Lab</p>
              <p className="text-sm text-[var(--text)]/60">Generate into a file</p>
            </a>
            <Link href="/platform/ai" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Free AI internals</p>
              <p className="text-sm text-[var(--text)]/60">How the chain works</p>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--sidebar-bg)] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Players Logo" className="w-6 h-6" />
              <span className="font-bold">Players</span>
            </div>
            <p className="text-sm text-[var(--text)]/60">
              Built by <a href="https://github.com/FallenNightA" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">FallenNightA</a>
              · Data from <a href="https://github.com/Bloxdy/code-api" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Bloxdy/code-api</a>
              <br />
              Official account: <a href="https://github.com/HidayatBelajar319" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">HidayatBelajar319</a> is one of the official accounts made by <a href="https://github.com/FallenNightA" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">FallenNightA</a> (owner)
            </p>
            <a href="https://github.com/HidayatBelajar319/BloxdUtility-Documentation" target="_blank" rel="noopener noreferrer" className="text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
