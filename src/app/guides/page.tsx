'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function GuidesPage() {
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

  const guides = [
    { title: 'Getting Started', href: '/guides/getting-started', description: 'Set up your development environment and create your first Bloxd.io script', category: 'Beginner', time: '5 min' },
    { title: 'Code Blocks Basics', href: '/guides/code-blocks', description: 'Learn how Code Blocks work, their limitations, and best practices', category: 'Beginner', time: '10 min' },
    { title: 'World Code & Callbacks', href: '/guides/world-code', description: 'Master World Code, global callbacks, and the delegator pattern', category: 'Intermediate', time: '15 min' },
    { title: 'Working with Blocks & Items', href: '/guides/blocks-items', description: 'Complete guide to block/item IDs, placement, and manipulation', category: 'Beginner', time: '10 min' },
    { title: 'Player Management', href: '/guides/players', description: 'Handle player joins, leaves, teams, and per-player data', category: 'Intermediate', time: '12 min' },
    { title: 'Creating Custom Mobs', href: '/guides/mobs', description: 'Spawn and configure custom mobs with MOB_SETTINGS', category: 'Advanced', time: '20 min' },
    { title: 'Mesh Entities & 3D Models', href: '/guides/mesh-entities', description: 'Create and animate 3D mesh entities in your worlds', category: 'Advanced', time: '15 min' },
    { title: 'Particle Effects', href: '/guides/particles', description: 'Add visual effects with the PARTICLES API', category: 'Intermediate', time: '10 min' },
    { title: 'Sound & Music', href: '/guides/sounds', description: 'Play sounds, music, and manage audio in your worlds', category: 'Beginner', time: '8 min' },
    { title: 'QTE (Quick Time Events)', href: '/guides/qte', description: 'Create interactive QTE sequences for gameplay', category: 'Advanced', time: '15 min' },
    { title: 'Client Options & UI', href: '/guides/client-options', description: 'Customize player UI, hotbars, and client settings', category: 'Intermediate', time: '10 min' },
    { title: 'Optimization & Performance', href: '/guides/optimization', description: 'Best practices for performant Bloxd.io scripts', category: 'Advanced', time: '15 min' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <style jsx global>{`
        :root {
          --bg: #ffffff;
          --text: #1f2328;
          --sidebar-bg: #f6f8fa;
          --border: #d0d7de;
          --nav-hover: #ebeff2;
          --nav-active-bg: #0969da;
          --nav-active-text: #ffffff;
          --primary: #3b82f6;
          --primary-hover: #2563eb;
        }
        .dark {
          --bg: #0d1117;
          --text: #e6edf3;
          --sidebar-bg: #161b22;
          --border: #30363d;
          --nav-hover: #21262d;
          --nav-active-bg: #1f6feb;
          --nav-active-text: #ffffff;
          --primary: #58a6ff;
          --primary-hover: #79c0ff;
        }
        body { font-family: 'Inter', sans-serif; }
      `}</style>

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
              <Link href="/guides" className="text-sm font-medium text-[var(--primary)] font-semibold">Guides</Link>
              <Link href="/bloxdbench" className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors">BloxdBench</Link>
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
          <span className="text-sm font-semibold text-[var(--text)]">Guides</span>
        </div>

        <section className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Guides & Tutorials</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            Step-by-step guides for Bloxd.io development. From beginner basics to advanced techniques.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="group p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    guide.category === 'Beginner' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                    guide.category === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                    'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}>{guide.category}</span>
                  <span className="text-xs text-[var(--text)]/50">{guide.time}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">{guide.title}</h3>
                <p className="text-sm text-[var(--text)]/70">{guide.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/documentation" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Full Documentation</p>
              <p className="text-sm text-[var(--text)]/60">All files with search</p>
            </Link>
            <Link href="/api" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">API Reference</p>
              <p className="text-sm text-[var(--text)]/60">Quick lookup</p>
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