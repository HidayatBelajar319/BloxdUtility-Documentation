'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CODE_SPAN =
  'font-mono text-[0.8em] bg-[var(--code-bg)] border border-[var(--border)] rounded px-1.5 py-0.5 break-all';

const categories = [
  {
    title: 'Mods',
    accent: 'purple',
    body: 'Gameplay modifications and enhancements — anything that changes how a world plays rather than how it looks.',
  },
  {
    title: 'Texture Packs',
    accent: 'blue',
    body: 'Custom textures and visual enhancements, published as pack files and loaded over the internet by the studio.',
  },
  {
    title: 'Server Plugins',
    accent: 'green',
    body: 'Server-side plugins and extensions, plus the technical guides for writing high-performance server logic.',
  },
];

const steps = [
  {
    title: 'One route, the site shell',
    body: '/modrinth is a client route in the App Router with the same sticky header, dark-mode toggle, and shared footer as every other page. Nothing about it is special-cased, so it inherits the theme and the responsive nav for free.',
  },
  {
    title: 'A centred hero states the scope',
    body: 'The page opens by naming exactly what the hub is for: community mods, texture packs, and server plugins, with discover, share, and manage as the three verbs. Breadcrumbs above it keep the way back to Home obvious.',
  },
  {
    title: 'A single primary call to action',
    body: 'One button opens the Modrinth Hub itself, framed by a short line about what you will find there. One obvious action beats a menu of near-identical entries.',
  },
  {
    title: 'Three resource classes',
    body: 'The category grid is the taxonomy of the whole ecosystem: Mods for behaviour, Texture Packs for appearance, Server Plugins for the server. Each card is a tinted tile with an inline SVG glyph and a one-line definition.',
  },
  {
    title: 'Assets resolve from the internet',
    body: 'Texture and model assets are not bundled with the site. They are fetched at runtime from Bloxdy/texture-packs, which is what v2.2 of the changelog describes, so a new pack is available the moment it is published.',
  },
  {
    title: 'The plugin system is the server story',
    body: 'The v1.7 release note describes the hub together with the advanced Plugin System and a dedicated Information Tab carrying technical guides for high-performance server logic — the same material the Plugin Auto-Merger and Command Studio tools act on.',
  },
];

const tech: Array<[string, string]> = [
  ['Route', 'app/modrinth/page.tsx (BloxdUtilityMain)'],
  ['Route on the live site', 'https://bloxdutility.netlify.app/modrinth'],
  ['Category grid', '3 cards — Mods, Texture Packs, Server Plugins'],
  ['Primary action', 'Open Modrinth Hub → next/link to /modrinth'],
  ['Icons', 'inline SVG paths on a 24×24 viewBox'],
  ['Tint pattern', 'bg-purple-500/10, bg-blue-500/10, bg-green-500/10'],
  ['Texture assets', 'Bloxdy/texture-packs over the internet (v2.2)'],
  ['Companion tool', 'Developer Tools → Plugin Auto-Merger at /tools/merger'],
  ['Documentation', 'app/api/textures/route.ts + app/api/assets/route.ts'],
  ['Shell', 'sticky header, dark-mode toggle, shared footer'],
  ['Changelog entry', 'v1.7 — Bloxd Modrinth Hub'],
  ['Deep category views', 'the hub section of the main site, one click from here'],
];

const usage = [
  'Open /modrinth on the main site, or the Bloxd Modrinth link in the sidebar, and read the hero line to confirm the hub is the right stop.',
  'Hit Open Modrinth Hub to land in the resource browser.',
  'Filter by class: Mods when you want different gameplay, Texture Packs when you want a different look, Server Plugins when the change belongs on the server.',
  'For a texture pack, note that assets load from Bloxdy/texture-packs at runtime — a slow connection shows it in the studio rather than in the hub.',
  'For a server plugin, read the Information Tab material on high-performance server logic before you install anything, then merge what you need with the Plugin Auto-Merger in Developer Tools.',
  'Keep the merged plugin small and test it in a throwaway world; server-side logic runs for every player, not just for you.',
];

const buildNotes = [
  'Taxonomy before features. Three well-defined classes are what make a hub navigable; a flat list of uploads is a file dump.',
  'Give every class a definition, not just a name. The one-liner under each heading is what tells a visitor whether the category is the right home for their file.',
  'Fetch assets at runtime from a published repository. Bundling them means a release for every texture change.',
  'One primary action per landing page. The categories explain the space, the button enters it.',
  'Link the hub to the tools that consume what it distributes, or discovery stops at the download.',
];

export default function PlatformModrinthHubPage() {
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
          <span className="text-sm font-semibold text-[var(--text)]">Modrinth Hub</span>
        </div>

        <section className="mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>
            Community resources, in three classes
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Bloxd Modrinth Hub</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            Bloxd Modrinth is the community resource hub for Bloxd.io and uses Next.js App Router links plus the shared
            design tokens for its category grid — so the whole hub is one themed landing page over three resource classes:
            gameplay mods, texture packs, and server plugins. Texture and model assets resolve at runtime from
            Bloxdy/texture-packs rather than being bundled, so publishing a pack needs no site release at all.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The three classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.title} className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl text-center">
                <div className={`w-12 h-12 bg-${category.accent}-500/10 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <svg className={`w-6 h-6 text-${category.accent}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        category.title === 'Mods'
                          ? 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z'
                          : category.title === 'Texture Packs'
                            ? 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                            : 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                      }
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <p className="text-[var(--text)]/70">{category.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">How it works</h2>
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={step.title} className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-black text-sm">
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
          <h2 className="text-2xl font-bold mb-6">The hub in code</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            A hero, one call to action, and three category cards. The tint is interpolated from the same data that names the
            category, so a fourth class needs one array entry and nothing else.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed">
{`<Link
  href="/modrinth"
  className="inline-block bg-[var(--primary)] text-white px-8 py-3 rounded-lg
             font-semibold hover:bg-[var(--primary-hover)] transition-colors
             shadow-lg shadow-[var(--primary)]/25"
>
  Open Modrinth Hub →
</Link>

{categories.map((c) => (
  <div key={c.title} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--sidebar-bg)]">
    <div className={\`w-12 h-12 bg-\${c.accent}-500/10 rounded-lg\`}>
      <svg className={\`w-6 h-6 text-\${c.accent}-500\`} viewBox="0 0 24 24" fill="none" stroke="currentColor" />
    </div>
    <h3>{c.title}</h3>
    <p>{c.body}</p>
  </div>
))}`}
          </pre>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">How to use it</h2>
          <ol className="space-y-3">
            {usage.map((item, index) => (
              <li key={item} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-xs font-black mt-0.5">
                  {index + 1}
                </span>
                <span className="text-[var(--text)]/70">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Code it yourself</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buildNotes.map((note) => (
              <div key={note} className="p-5 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
                <p className="text-sm text-[var(--text)]/70">{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-bold mb-6">Try it</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="https://bloxdutility.netlify.app/modrinth" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Modrinth Hub</p>
              <p className="text-sm text-[var(--text)]/60">Main site /modrinth</p>
            </a>
            <a href="https://bloxdutility.netlify.app/tools" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Plugin Auto-Merger</p>
              <p className="text-sm text-[var(--text)]/60">Combine plugins</p>
            </a>
            <Link href="/platform/bloxdbench" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">BloxdBench</p>
              <p className="text-sm text-[var(--text)]/60">Same texture packs</p>
            </Link>
            <Link href="/platform" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">All features</p>
              <p className="text-sm text-[var(--text)]/60">Platform index</p>
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
