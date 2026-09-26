'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function APIPage() {
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

  const apiCategories = [
    { name: 'Functions', href: '/api/functions', icon: 'fa-code', color: 'blue', count: '50+', description: 'All API functions with examples' },
    { name: 'Callbacks', href: '/api/callbacks', icon: 'fa-bell', color: 'green', count: '40+', description: 'Event callbacks and handlers' },
    { name: 'Blocks', href: '/api/blocks', icon: 'fa-cube', color: 'purple', count: '200+', description: 'Complete block ID reference' },
    { name: 'Items', href: '/api/items', icon: 'fa-sword', color: 'orange', count: '300+', description: 'Complete item ID reference' },
    { name: 'Client Options', href: '/api/client-options', icon: 'fa-sliders-h', color: 'pink', count: '20+', description: 'Client configuration options' },
    { name: 'Icons', href: '/api/icons', icon: 'fa-icons', color: 'cyan', count: '100+', description: 'UI icon references' },
    { name: 'Mesh Entities', href: '/api/mesh-entities', icon: 'fa-cubes', color: 'indigo', count: '10+', description: '3D mesh entity docs' },
    { name: 'Particles', href: '/api/particles', icon: 'fa-sparkles', color: 'rose', count: '30+', description: 'Particle effect references' },
    { name: 'Sounds & Music', href: '/api/sounds', icon: 'fa-music', color: 'amber', count: '50+', description: 'Audio references' },
    { name: 'QTE', href: '/api/qte', icon: 'fa-gamepad', color: 'emerald', count: '5+', description: 'Quick Time Event docs' },
    { name: 'Skins & Poses', href: '/api/skins', icon: 'fa-user', color: 'violet', count: '20+', description: 'Character customization' },
    { name: 'Mob Settings', href: '/api/mobs', icon: 'fa-dragon', color: 'red', count: '15+', description: 'Mob configuration' },
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
              <Link href="/api" className="text-sm font-medium text-[var(--primary)] font-semibold">API Reference</Link>
              <Link href="/guides" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">Guides</Link>
              <Link href="/bloxdbench" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">BloxdBench</Link>
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
          <Link href="/documentation" className="text-sm text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors">Documentation</Link>
          <span className="text-sm text-[var(--text)]/40 mx-2">/</span>
          <span className="text-sm font-semibold text-[var(--text)]">API Reference</span>
        </div>

        <section className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">API Reference</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            Complete reference for all Bloxd.io API functions, callbacks, blocks, items, and configuration options.
            Auto-synced from the official <a href="https://github.com/Bloxdy/code-api" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline font-semibold">Bloxdy/code-api</a> repository.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {apiCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-${cat.color}-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${cat.color}-500/20 transition-colors`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconPath(cat.icon)} />
                  </svg>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{cat.name}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${cat.color}-500/10 text-${cat.color}-600 dark:text-${cat.color}-400`}>{cat.count}</span>
                </div>
                <p className="text-sm text-[var(--text)]/70">{cat.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/documentation" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Full Documentation</p>
              <p className="text-sm text-[var(--text)]/60">All files with search</p>
            </Link>
            <Link href="/guides/getting-started" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Getting Started</p>
              <p className="text-sm text-[var(--text)]/60">Beginner guide</p>
            </Link>
            <Link href="/bloxdbench" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">BloxdBench</p>
              <p className="text-sm text-[var(--text)]/60">Voxel model editor</p>
            </Link>
            <a href="https://bloxdutility.netlify.app/" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Main Website</p>
              <p className="text-sm text-[var(--text)]/60">Live demo & tools</p>
            </a>
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

function getIconPath(icon: string): string {
  const icons: Record<string, string> = {
    'fa-code': 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    'fa-bell': 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    'fa-cube': 'M8 15l3-3 3 3 3-3v6l-3 3-3-3-3 3V15z',
    'fa-sword': 'M13 2L3 12l7 7 10-10-7-7z',
    'fa-sliders-h': 'M3 15a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4zM7 10a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4zM3 5a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V5z',
    'fa-icons': 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    'fa-cubes': 'M8 15l3-3 3 3 3-3v6l-3 3-3-3-3 3V15zM19 15l-3-3-3 3-3-3v6l3 3 3-3 3 3V15z',
    'fa-sparkles': 'M5 3v4M3 5h4M12 2v4M10 4h4M19 3v4M17 5h4M21 12h-4M23 10v4M12 19v4M10 21h4M3 19v-4M5 17h4',
    'fa-music': 'M9 18V5l12-2v13M9 9l12 2M9 15l12 2',
    'fa-gamepad': 'M21 12a9 9 0 01-9 9 9.35 9.35 0 01-6.74-2.88L3 21l1.9-5.7a9.38 9.38 0 01-.87-6.72A9 9 0 1121 12z',
    'fa-user': 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 13a4 4 0 000-8 4 4 0 000 8z',
    'fa-dragon': 'M21 12a9 9 0 01-9 9 9.35 9.35 0 01-6.74-2.88L3 21l1.9-5.7a9.38 9.38 0 01-.87-6.72A9 9 0 1121 12z',
  };
  return icons[icon] || 'M13 2L3 14h9l-1 8 10-12h-9l1-8z';
}