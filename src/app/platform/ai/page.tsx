'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CODE_SPAN = 'font-mono text-[0.8em] bg-[var(--code-bg)] border border-[var(--border)] rounded px-1.5 py-0.5 break-all';

const steps = [
  {
    title: 'Resolve the chain',
    body: 'Nothing is hardcoded to one vendor. On every call the module reads the saved keys out of localStorage and builds an ordered list: Puter.js first, then OpenRouter if a key exists, then Groq, and finally Pollinations only when a real key is present.',
  },
  {
    title: 'Load Puter.js on demand',
    body: 'The Puter script is injected lazily with a hard load timeout, and the promise is cached so the tag is only added once per session. If the script loads but never exposes window.puter, the call fails with an explicit message instead of hanging.',
  },
  {
    title: 'Send the request',
    body: 'Puter goes through puter.ai.chat with streaming. OpenRouter and Groq are OpenAI-compatible SSE endpoints streamed by hand from the response body. Pollinations is a single non-streamed POST with the key sent as a bearer token.',
  },
  {
    title: 'Wait for the first token',
    body: 'Every provider gets a 30-second first-token budget. A stream that sends nothing in that window is cancelled — the reader is released, the attempt is recorded as a failure, and the next provider in the chain is tried.',
  },
  {
    title: 'Validate before it is used',
    body: 'The reply is checked against the budget/quota error patterns, the ENOSPC markers, and the stale anonymous-Pollinations fingerprint. A payload that is a service failure is never treated as model output.',
  },
  {
    title: 'Extract the fenced block',
    body: 'Only the fenced code block is applied. If there is no clean block — or the block itself sniffs as an error — nothing is inserted into the editor, and the reason is shown instead.',
  },
];

const tech: Array<[string, string]> = [
  ['Shared module', 'lib/free-ai.ts (BloxUtilityMain)'],
  ['Entry point', 'requestFreeAi({ messages, provider, task })'],
  ['Puter script', 'https://js.puter.com/v2/'],
  ['Puter call', 'window.puter.ai.chat(messages, { model, stream: true })'],
  ['Default Puter model', 'gpt-5.6-luna'],
  ['First-token budget', 'FIRST_TOKEN_TIMEOUT_MS = 30000'],
  ['Stream watchdog', '120000 ms'],
  ['Key storage', 'localStorage → bloxd.free-ai.keys.v1'],
  ['OpenRouter', 'https://openrouter.ai/api/v1/chat/completions'],
  ['OpenRouter model', 'openrouter/free'],
  ['Groq', 'https://api.groq.com/openai/v1/chat/completions'],
  ['Groq model', 'llama-3.3-70b-versatile'],
  ['Pollinations', 'https://gen.pollinations.ai/v1/chat/completions'],
  ['Pollinations gate', 'isPollinationsKey() → /^(pk_|sk_)/'],
  ['Error sniffing', 'looksLikeProviderError(raw, { isCodeBlock })'],
  ['Fenced extraction', 'extractFencedCode(text) → { code, lang }'],
];

export default function PlatformAiPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedDark = localStorage.getItem('darkMode') === 'true';
    setIsDark(savedDark);
    document.documentElement.classList.toggle('dark', savedDark);
  }, []);

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('darkMode', String(newDark));
    document.documentElement.classList.toggle('dark', newDark);
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
              <Link href="/ai" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">Bloxd AI</Link>
              <Link href="/platform" className="text-sm font-medium text-[var(--primary)] font-semibold">Platform</Link>
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
          <Link href="/platform" className="text-sm text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors">Platform</Link>
          <span className="text-sm text-[var(--text)]/40 mx-2">/</span>
          <span className="text-sm font-semibold text-[var(--text)]">Free AI</span>
        </div>

        <section className="mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            No key required — Puter.js is the default provider
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Free AI system</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            The whole platform writes code through one shared AI module. The default path needs no account and no key:
            Puter.js absorbs the call. If that fails, your own free OpenRouter or Groq key is used. Pollinations is only ever
            reachable behind a real key. This page describes that chain and the validation that runs before any generated text
            reaches the editor.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The provider chain</h2>
          <div className="space-y-4">
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl border-l-4 border-l-emerald-500">
              <h3 className="text-lg font-bold mb-1">1 — Puter.js (default, no key)</h3>
              <p className="text-[var(--text)]/70">
                Loaded from <code className={CODE_SPAN}>https://js.puter.com/v2/</code> on first use, then called through{' '}
                <code className={CODE_SPAN}>puter.ai.chat(messages, &#123; model, stream: true &#125;)</code>. There is no key to
                paste and no CORS proxy. The catch is sign-in: Puter authenticates in a popup, so if the popup is blocked the
                module reports a <code className={CODE_SPAN}>popup-blocked</code> error with the instruction to allow popups for
                the site rather than spinning forever.
              </p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl border-l-4 border-l-blue-500">
              <h3 className="text-lg font-bold mb-1">2 — Your own key: OpenRouter, then Groq</h3>
              <p className="text-[var(--text)]/70">
                Both are OpenAI-compatible and streamed over SSE from the browser. Keys are pasted in Settings, trimmed, and
                stored in <code className={CODE_SPAN}>localStorage</code> under{' '}
                <code className={CODE_SPAN}>bloxd.free-ai.keys.v1</code>. They are read at call time, never committed to the
                repository, and never sent anywhere except the provider the key belongs to.
              </p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl border-l-4 border-l-orange-500">
              <h3 className="text-lg font-bold mb-1">3 — Pollinations, key-gated and body-sniffed</h3>
              <p className="text-[var(--text)]/70">
                Anonymous Pollinations access is deliberately not supported: the shared budget is exhausted, and the service
                answers with HTTP 200 while the body carries an ENOSPC or quota message or a stale cached completion. So the
                provider only enters the chain when a key starting with <code className={CODE_SPAN}>pk_</code> or{' '}
                <code className={CODE_SPAN}>sk_</code> is present, and every response body is sniffed for those strings before
                it is surfaced.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">How it works</h2>
          <ol className="space-y-4">
            {steps.map((step, index) => (
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
                {tech.map(([part, value]) => (
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
          <h2 className="text-2xl font-bold mb-6">The chain in code</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            Keys are read fresh on every request, the chain is resolved from them, and each attempt is validated before the
            next one is tried.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed mb-4">
{`const keys = getFreeAiKeys();                 // read from localStorage each call
const chain = resolveProviderChain("auto", keys);
// → puter, then openrouter, then groq, then pollinations (key-gated)

for (const attempt of chain) {
  const text = await callProvider(attempt, messages, { signal });
  const out = validateModelOutput(text, attempt.label);
  if (out.ok) return out.text;                // only clean output escapes
}
// every provider failed → report all failures together`}
          </pre>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Fenced code extraction</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            The system prompt requires every answer to wrap its code in a tagged fence. That makes extraction deterministic —
            and it is also the guard rail. A block that is only a quota message is rejected, so a provider failure can never
            land in the file you are editing.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed">
{`const block = extractFencedCode(reply);      // last fence wins, or the largest
if (!block) return;                          // nothing safe to apply
if (looksLikeProviderError(block.code, { isCodeBlock: true })) return;
applyToActiveFile(block.code, block.lang);`}
          </pre>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Failure messages you may see</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h3 className="font-bold mb-1">Popup blocked</h3>
              <p className="text-sm text-[var(--text)]/70">
                Puter signs you in through a popup window. If it never appeared, the browser blocked it — allow popups for
                this site and try again.
              </p>
            </div>
            <div className="p-5 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h3 className="font-bold mb-1">No output in 30s</h3>
              <p className="text-sm text-[var(--text)]/70">
                The provider sent no output within 30 seconds. The request is cancelled and the next provider in the chain is
                tried.
              </p>
            </div>
            <div className="p-5 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h3 className="font-bold mb-1">Service error, not an answer</h3>
              <p className="text-sm text-[var(--text)]/70">
                The provider returned an ENOSPC / budget / stale-cache payload instead of an answer. Nothing was applied — add
                your own free key in Settings, or try again later.
              </p>
            </div>
            <div className="p-5 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h3 className="font-bold mb-1">Missing key</h3>
              <p className="text-sm text-[var(--text)]/70">
                Pollinations needs your own key, starting with <code className={CODE_SPAN}>pk_</code> or{' '}
                <code className={CODE_SPAN}>sk_</code>. Paste it in Settings.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-bold mb-6">Try it</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="https://bloxdutility.netlify.app/bloxd-ai" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Free AI</p>
              <p className="text-sm text-[var(--text)]/60">Main site /bloxd-ai</p>
            </a>
            <a href="https://bloxdutility.netlify.app/lab" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Code Lab</p>
              <p className="text-sm text-[var(--text)]/60">Generate into a file</p>
            </a>
            <Link href="/platform/code-lab" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Code Lab internals</p>
              <p className="text-sm text-[var(--text)]/60">How it applies output</p>
            </Link>
            <Link href="/platform/data" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Data pipeline</p>
              <p className="text-sm text-[var(--text)]/60">What it reads</p>
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
