'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CODE_SPAN = 'font-mono text-[0.8em] bg-[var(--code-bg)] border border-[var(--border)] rounded px-1.5 py-0.5 break-all';

const features = [
  {
    title: 'Code Lab',
    href: '/platform/code-lab',
    accent: 'text-blue-500',
    accentBg: 'bg-blue-500/10',
    accentHover: 'group-hover:bg-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    live: 'https://bloxdutility.netlify.app/lab',
    liveLabel: '/lab',
    description:
      'A Monaco-powered code editor for Bloxd.io with autocomplete built from the official code-api data, a multi-file workspace, and CodexMind AI that writes into the file you are editing.',
    tech: ['@monaco-editor/react', 'marked', 'GitHub REST'],
    related: [
      { label: 'API Reference', href: '/api' },
      { label: 'Getting Started', href: '/guides/getting-started' },
    ],
  },
  {
    title: 'BloxdBench',
    href: '/platform/bloxdbench',
    accent: 'text-purple-500',
    accentBg: 'bg-purple-500/10',
    accentHover: 'group-hover:bg-purple-500/20',
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    live: 'https://bloxdutility.netlify.app/bloxd-bench',
    liveLabel: '/bloxd-bench',
    description:
      'A Three.js voxel studio for block, item, and free-form models. Templates, textures, and skyboxes are pulled straight from Bloxdy/texture-packs over the internet, then exported as Bloxd.js code.',
    tech: ['Three.js', 'GLTFLoader', 'api.github.com'],
    related: [
      { label: 'Mesh Entities', href: '/guides/mesh-entities' },
      { label: 'BloxdBench', href: '/bloxdbench' },
    ],
  },
  {
    title: 'Free AI System',
    href: '/platform/ai',
    accent: 'text-emerald-500',
    accentBg: 'bg-emerald-500/10',
    accentHover: 'group-hover:bg-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    live: 'https://bloxdutility.netlify.app/bloxd-ai',
    liveLabel: '/bloxd-ai',
    description:
      'Zero-config AI with no key required. Puter.js is tried first, then your own OpenRouter or Groq key, and only then Pollinations behind a real key — with every response validated before it reaches the editor.',
    tech: ['Puter.js', 'lib/free-ai.ts', 'localStorage BYOK'],
    related: [
      { label: 'Callbacks', href: '/api' },
      { label: 'World Code', href: '/guides/world-code' },
    ],
  },
  {
    title: 'Data Pipeline',
    href: '/platform/data',
    accent: 'text-orange-500',
    accentBg: 'bg-orange-500/10',
    accentHover: 'group-hover:bg-orange-500/20',
    badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    live: 'https://bloxdutility.netlify.app/documentation',
    liveLabel: '/documentation',
    description:
      'How every doc file, API name, and asset list reaches the browser: auto-discovery from Bloxdy/code-api, a hardcoded fallback, full-text search, TOC, bookmarks, export, and one global stylesheet for theming.',
    tech: ['src/lib/docs-data.ts', 'marked', 'Prism.js'],
    related: [
      { label: 'Full Documentation', href: '/documentation' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
];

export default function PlatformPage() {
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
          <span className="text-sm font-semibold text-[var(--text)]">Platform</span>
        </div>

        <section className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Our Platform Features</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            These are the systems we build and run on the Players platform — the code editor, the voxel studio, the free AI
            layer, and the data pipeline that feeds all of them. Every page here explains what the feature is, how it works,
            and the exact code and libraries that power it.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The four features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${feature.badge}`}>{feature.title}</span>
                  <a
                    href={feature.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[var(--text)]/50 hover:text-[var(--primary)] transition-colors"
                  >
                    live {feature.liveLabel} →
                  </a>
                </div>
                <Link href={feature.href} className="group block">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">{feature.title}</h3>
                </Link>
                <p className="text-[var(--text)]/70 mb-4">{feature.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {feature.tech.map((item) => (
                    <span key={item} className={`text-xs font-semibold px-2 py-1 rounded ${feature.accentBg} ${feature.accent}`}>
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                  <Link href={feature.href} className="text-[var(--primary)] hover:underline">
                    How it works →
                  </Link>
                  {feature.related.map((rel) => (
                    <Link key={rel.href} href={rel.href} className="text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors">
                      {rel.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">How the platform fits together</h2>
          <div className="space-y-4">
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h3 className="text-lg font-bold mb-2">1 — Data first</h3>
              <p className="text-[var(--text)]/70">
                The pipeline discovers the documentation file list from{' '}
                <code className={CODE_SPAN}>api.github.com/repos/Bloxdy/code-api/contents</code>, fetches each file raw, and keeps a
                hardcoded fallback so the site still renders when GitHub is unreachable. Those same files become the
                autocomplete vocabulary for the editor. See <Link href="/platform/data" className="text-[var(--primary)] hover:underline font-semibold">Data pipeline</Link>.
              </p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h3 className="text-lg font-bold mb-2">2 — Tools on top of that data</h3>
              <p className="text-[var(--text)]/70">
                Code Lab turns the discovered API into an editing experience, and BloxdBench turns the published texture packs
                into a modelling one. Neither ships a hardcoded copy of the data. See{' '}
                <Link href="/platform/code-lab" className="text-[var(--primary)] hover:underline font-semibold">Code Lab</Link> and{' '}
                <Link href="/platform/bloxdbench" className="text-[var(--primary)] hover:underline font-semibold">BloxdBench</Link>.
              </p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h3 className="text-lg font-bold mb-2">3 — One AI layer everywhere</h3>
              <p className="text-[var(--text)]/70">
                A single provider chain — Puter.js first, BYOK keys second, Pollinations last — backs generation in the editor,
                the chat panel, and the studio. Output is validated and the fenced code block is extracted before it is applied.
                See <Link href="/platform/ai" className="text-[var(--primary)] hover:underline font-semibold">Free AI system</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Try it</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="https://bloxdutility.netlify.app/lab" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Code Lab</p>
              <p className="text-sm text-[var(--text)]/60">Monaco editor</p>
            </a>
            <a href="https://bloxdutility.netlify.app/bloxd-bench" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">BloxdBench</p>
              <p className="text-sm text-[var(--text)]/60">Voxel studio</p>
            </a>
            <a href="https://bloxdutility.netlify.app/bloxd-ai" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Free AI</p>
              <p className="text-sm text-[var(--text)]/60">No key needed</p>
            </a>
            <a href="https://bloxdutility.netlify.app/documentation" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Live Docs</p>
              <p className="text-sm text-[var(--text)]/60">Auto-synced</p>
            </a>
          </div>
        </section>

        <section className="border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-bold mb-6">Related docs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/documentation" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Documentation</p>
              <p className="text-sm text-[var(--text)]/60">All files</p>
            </Link>
            <Link href="/api" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">API Reference</p>
              <p className="text-sm text-[var(--text)]/60">Functions &amp; blocks</p>
            </Link>
            <Link href="/guides" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Guides</p>
              <p className="text-sm text-[var(--text)]/60">Tutorials</p>
            </Link>
            <Link href="/changelog" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Changelog</p>
              <p className="text-sm text-[var(--text)]/60">Release history</p>
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
