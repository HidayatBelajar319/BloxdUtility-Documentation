'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CODE_SPAN = 'font-mono text-[0.8em] bg-[var(--code-bg)] border border-[var(--border)] rounded px-1.5 py-0.5 break-all';

const steps = [
  {
    title: 'List the repository root',
    body: 'One GET against the GitHub contents endpoint returns every entry at the root of Bloxdy/code-api. The site never ships a hand-maintained file list, so a file added upstream shows up on its own.',
  },
  {
    title: 'Keep only the text docs',
    body: 'The listing is filtered down to .md and .txt files. Directories and anything else are dropped, which is why the sidebar only ever contains readable documentation.',
  },
  {
    title: 'Fetch each file raw',
    body: 'Content is pulled from the raw host rather than the API payload, so the reader gets plain Markdown with no metadata wrapper. Both endpoints are unauthenticated and CORS-friendly.',
  },
  {
    title: 'Fall back to a hardcoded list',
    body: 'A hardcoded list of the same files lives in src/lib/docs-data.ts. If the network, GitHub, or a rate limit gets in the way, the site renders the fallback content and shows a status badge instead of going blank.',
  },
  {
    title: 'Index it for search',
    body: 'Every loaded file is scanned once into a match list of file name, index, start offset, and snippet. The search box runs over that index, which is why it stays fast as the documentation grows.',
  },
  {
    title: 'Derive the reader chrome',
    body: 'Headings are parsed out of the Markdown to build the table of contents and to give every section a stable slug. Those same slugs back bookmarks, so a bookmark lands on the section instead of the top of the page.',
  },
];

const tech: Array<[string, string]> = [
  ['Discovery endpoint', 'https://api.github.com/repos/Bloxdy/code-api/contents'],
  ['Content endpoint', 'https://raw.githubusercontent.com/Bloxdy/code-api/main'],
  ['Repository link', 'https://github.com/Bloxdy/code-api'],
  ['File filter', '/\\.(md|txt)$/i'],
  ['Discovery + fallback data', 'src/lib/docs-data.ts'],
  ['Consumer', 'src/app/documentation/page.tsx'],
  ['Markdown rendering', 'marked'],
  ['Syntax highlighting', 'prismjs + prism-typescript'],
  ['Search index shape', '{ fileName, index, start, snippet }'],
  ['Heading slugs', 'slugify() + uniqueSlug()'],
  ['Theme tokens', 'src/app/globals.css (:root / .dark)'],
  ['Theme persistence', 'localStorage darkMode'],
  ['Export', 'Markdown export + print stylesheet'],
];

export default function PlatformDataPage() {
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
          <Link href="/platform" className="text-sm text-[var(--text)]/60 hover:text-[var(--primary)] transition-colors">Platform</Link>
          <span className="text-sm text-[var(--text)]/40 mx-2">/</span>
          <span className="text-sm font-semibold text-[var(--text)]">Data</span>
        </div>

        <section className="mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Auto-discovered from Bloxdy/code-api, with a hardcoded fallback
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Data pipeline</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            Everything on this site is fed by one pipeline. The file list is discovered from the code-api repository at runtime,
            the content is fetched raw, and a hardcoded list catches any failure. That same corpus drives search, the table of
            contents, bookmarks, and export — and the entire site is themed from a single stylesheet.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">How it works</h2>
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={step.title} className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-sm">
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
          <h2 className="text-2xl font-bold mb-6">Discovery in code</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            One listing call, one filter, then a raw fetch per file. The fallback list has the same shape, so switching
            between live data and fallback data needs no changes anywhere else in the reader.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed mb-4">
{`const res = await fetch(CODE_API_CONTENTS, {
  headers: { Accept: "application/vnd.github+json" },
});
const entries = await res.json();

const docs = entries
  .filter((e) => e.type === "file" && /\\.(md|txt)$/i.test(e.name))
  .map((e) => ({ name: e.name, url: \`\${CODE_API_RAW}/\${e.name}\` }));

// any failure -> FALLBACK_DOC_FILES in src/lib/docs-data.ts`}
          </pre>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Search, TOC, bookmarks, export</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h3 className="text-lg font-bold mb-2">Full-text search</h3>
              <p className="text-[var(--text)]/70 mb-3">
                Every loaded file is scanned once into a match list. Results are keyboard-navigable and the matched run is
                wrapped so it can be highlighted in the reader.
              </p>
              <code className={CODE_SPAN}>{'{ fileName, index, start, snippet }'}</code>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h3 className="text-lg font-bold mb-2">Table of contents</h3>
              <p className="text-[var(--text)]/70 mb-3">
                Headings are parsed out of the Markdown and turned into indented nested entries. Repeated headings get a
                numeric suffix so no two anchors collide.
              </p>
              <code className={CODE_SPAN}>slugify() + uniqueSlug()</code>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h3 className="text-lg font-bold mb-2">Bookmarks</h3>
              <p className="text-[var(--text)]/70 mb-3">
                A bookmark is a slug plus a label. Because the slug is the section anchor id, restoring one scrolls straight
                to the section you saved.
              </p>
              <code className={CODE_SPAN}>{'interface Bookmark { id: string; label: string }'}</code>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
              <h3 className="text-lg font-bold mb-2">Export &amp; print</h3>
              <p className="text-[var(--text)]/70 mb-3">
                Any file can be exported as Markdown, and a print stylesheet drops the sidebar, toolbar, and TOC so a printed
                page is just the document.
              </p>
              <code className={CODE_SPAN}>@media print in src/app/globals.css</code>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Theming</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            There is exactly one stylesheet. Light and dark are the same set of custom properties, redefined under a{' '}
            <code className={CODE_SPAN}>.dark</code> class on the root element, and the toggle simply flips that class and
            writes the choice to <code className={CODE_SPAN}>localStorage</code>. No page owns a colour of its own.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed">
{`:root { --bg: #ffffff; --text: #1f2328; --primary: #3b82f6; }
.dark { --bg: #0d1117; --text: #e6edf3; --primary: #58a6ff; }`}
          </pre>
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

        <section className="border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-bold mb-6">Try it</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="https://bloxdutility.netlify.app/documentation" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Live docs</p>
              <p className="text-sm text-[var(--text)]/60">Main site /documentation</p>
            </a>
            <a href="https://github.com/Bloxdy/code-api" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">code-api</p>
              <p className="text-sm text-[var(--text)]/60">Upstream source</p>
            </a>
            <Link href="/documentation" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Full Documentation</p>
              <p className="text-sm text-[var(--text)]/60">Search &amp; TOC</p>
            </Link>
            <Link href="/api" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">API Reference</p>
              <p className="text-sm text-[var(--text)]/60">Names &amp; items</p>
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
