'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ChangelogPage() {
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

  const releases = [
    {
      version: 'v1.3',
      date: 'September 26, 2026',
      tag: 'Newest',
      tagClass: 'bg-green-500/10 text-green-600 dark:text-green-400',
      summary: 'The changelog page itself, plus Changelog links in the nav on every page.',
      added: [
        'Changelog page at /changelog listing every release of the documentation site',
        'Changelog link added to the primary navigation on all pages',
        'CHANGELOG.md Markdown file kept in sync with the on-site changelog',
      ],
      changed: [
        'All footers now carry the official-accounts notice',
        'Changelog entries reuse the existing card styling for consistency',
      ],
    },
    {
      version: 'v1.2',
      date: 'September 20, 2026',
      tag: null,
      tagClass: '',
      summary: 'Game Features and the secret items that are code-only.',
      added: [
        'Game Features section covering the Bloxd.io gameplay systems now documented',
        'Secret / code-only items section with IDs and usage notes',
        'Copy-paste code snippets for every secret item',
      ],
      changed: [
        'Item and block tables expanded to cover the newly documented Game Features',
        'Secret items flagged with their own badge in the item listings',
      ],
    },
    {
      version: 'v1.1',
      date: 'September 12, 2026',
      tag: 'Auto-sync',
      tagClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      summary: 'Documentation files are now discovered automatically from Bloxdy/code-api.',
      added: [
        'GitHub auto-discovery of documentation files from Bloxdy/code-api',
        'Sidebar file list generated from the discovered repository contents',
        'Direct link back to the source of every file on GitHub',
      ],
      changed: [
        'Sync runs automatically, keeping the site aligned with upstream',
        'Manual file listing removed in favour of the auto-discovered list',
      ],
    },
    {
      version: 'v1.0',
      date: 'September 1, 2026',
      tag: 'Initial release',
      tagClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      summary: 'The first version of the documentation site.',
      added: [
        'Home landing page with hero, feature grid, and quick links',
        '/documentation — full documentation browser with table of contents',
        '/api — API reference for functions, callbacks, blocks, items, and variables',
        '/guides — guides index for step-by-step Bloxd.io tutorials',
        '/bloxdbench — BloxdBench voxel model editor',
        'Dark mode toggle with the choice persisted in localStorage',
        'Full-text search across every documentation file with match highlighting',
        'Bookmarks for sections you want to come back to',
        'Export as Markdown, plus print-friendly output for offline reference',
      ],
      changed: [
        'Site-wide design tokens drive both light and dark themes',
      ],
    },
  ];

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
              <Link href="/changelog" className="text-sm font-medium text-[var(--primary)] font-semibold">Changelog</Link>
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
          <span className="text-sm font-semibold text-[var(--text)]">Changelog</span>
        </div>

        <section className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Changelog</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            Every release of the Players documentation site, newest first. The same history is available as
            <a href="https://github.com/HidayatBelajar319/BloxdUtility-Documentation" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline font-semibold"> CHANGELOG.md</a>
            {' '}in the repository.
          </p>
        </section>

        <section className="space-y-6">
          {releases.map((release) => (
            <div key={release.version} className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold">{release.version}</h2>
                {release.tag && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${release.tagClass}`}>{release.tag}</span>
                )}
              </div>
              <p className="text-sm text-[var(--text)]/50 mb-4">{release.date}</p>
              <p className="text-[var(--text)]/80 mb-5">{release.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text)]/60 mb-2">Added</h3>
                  <ul className="space-y-1.5">
                    {release.added.map((item) => (
                      <li key={item} className="text-sm text-[var(--text)]/70 flex gap-2">
                        <span className="text-green-500">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text)]/60 mb-2">Changed</h3>
                  <ul className="space-y-1.5">
                    {release.changed.map((item) => (
                      <li key={item} className="text-sm text-[var(--text)]/70 flex gap-2">
                        <span className="text-yellow-500">~</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
            <h2 className="text-xl font-bold mb-2">Official Accounts</h2>
            <p className="text-[var(--text)]/80">
              Official account:{' '}
              <a href="https://github.com/HidayatBelajar319" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline font-semibold">HidayatBelajar319</a>{' '}
              is an official account made by{' '}
              <a href="https://github.com/FallenNightA" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline font-semibold">FallenNightA</a>{' '}
              (owner). Verify any account claiming to be part of Bloxd Utility against these links before using it.
            </p>
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
            <p className="text-sm text-[var(--text)]/60 text-center">
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
