'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CODE_SPAN =
  'font-mono text-[0.8em] bg-[var(--code-bg)] border border-[var(--border)] rounded px-1.5 py-0.5 break-all';

const releases = [
  { version: 'v2.3', title: 'Players Rebrand', body: 'Rebranded the site as Players, replaced the raster logo with a scalable SVG, and removed the personal-features text from the public site.' },
  { version: 'v2.2', title: 'BloxdBench Internet Assets', body: 'Models, textures, and skyboxes now load over the internet from Bloxdy/texture-packs; the local asset folders were deleted.' },
  { version: 'v2.1', title: 'Internal Documentation', body: 'Automatic discovery from Bloxdy/code-api, a Bloxd.io Game Features tab, and a searchable collection of secret code-only items and blocks.' },
  { version: 'v2.0', title: 'Clean URLs & App Router', body: 'HTML routes replaced with clean URLs and an app/home route; the legacy HTML files were deleted.' },
  { version: 'v1.9', title: 'CodexMind AI Developer Integration', body: 'Server-side CodexMind compiled plain-text prompts live over SSE inside Code Lab and Command Studio, with editor population.' },
  { version: 'v1.8', title: 'Developer Tools & Syntax Engine', body: 'The Developer Tools page launched with the M2B Schematic Converter, the Plugin Auto-Merger, and the Visual QTE Generator.' },
  { version: 'v1.7', title: 'Bloxd Modrinth Hub', body: 'Community hub for mods, texture packs, and the plugin system, with technical guides for high-performance server logic.' },
  { version: 'v1.6', title: 'Global Navigation & UI Sync', body: 'Sidebar navigation unified across pages and the official API documentation integrated with live GitHub syncing.' },
  { version: 'v1.5', title: 'Documentation Redesign', body: 'Improved docs layout, section bookmarking, and a reading progress indicator.' },
  { version: 'v1.4', title: 'Utility Home Dashboard', body: 'Live community stats, a rotating developer tip system, and the API function spotlight module.' },
  { version: 'v1.0', title: 'Initial Launch', body: 'The custom mega-prompt template for Bloxd.io scripts and the original Monaco-powered Code Lab.' },
];

const steps = [
  {
    title: 'The log is one string',
    body: 'The whole history is a single CHANGELOG_MARKDOWN template literal in app/changelog/page.tsx. There is no database, no JSON file, and no fetch — a release note is a heading and a paragraph.',
  },
  {
    title: 'It is rendered as Markdown',
    body: 'react-markdown with remark-gfm turns the string into the page, so bold text, links, and inline code in a note behave exactly as they would in any README.',
  },
  {
    title: 'Headings are rewritten into badges',
    body: 'A custom h2 renderer matches the heading text against /^v\\d+(\\.\\d+)*\\s+[—-]\\s+(.+)$/ and splits it into a version pill plus a title. Adding a release means writing "## v2.4 — Title" and nothing else.',
  },
  {
    title: 'Nested nodes are flattened first',
    body: 'nodeText() walks a ReactNode — strings, numbers, arrays, and element children — and concatenates the text. That is what makes the regex see "v2.3 — Players Rebrand" instead of a tree of fragments.',
  },
  {
    title: 'Links always open safely',
    body: 'The anchor override adds target="_blank" and rel="noopener noreferrer" to every link in a note, so a repository URL in a release description can never hand window.opener to another site.',
  },
  {
    title: 'The nav marks the current page',
    body: 'The nine site routes live in one NAV_LINKS array. The active entry is chosen by comparing href with /changelog, which also swaps in the clipboard icon next to the label.',
  },
];

const tech: Array<[string, string]> = [
  ['Route', 'app/changelog/page.tsx (BloxdUtilityMain)'],
  ['Route on the live site', 'https://bloxdutility.netlify.app/changelog'],
  ['Source of truth', 'CHANGELOG_MARKDOWN — one template literal'],
  ['Releases tracked', 'v1.0 through v2.3 — 11 entries'],
  ['Renderer', 'react-markdown + remark-gfm'],
  ['Heading matcher', '/^(v\\d+(?:\\.\\d+)*)\\s+[—-]\\s+(.+)$/'],
  ['Node flattener', 'nodeText(node: ReactNode): string'],
  ['Version badge', '.version-badge inside .changelog-markdown'],
  ['Link override', 'target="_blank" rel="noopener noreferrer"'],
  ['Nav source', 'NAV_LINKS — 9 routes, active matched by href'],
  ['Active icon', 'CHANGELOG_ICON_PATH on a 24×24 viewBox'],
  ['Dashboard mirror', 'the Home dashboard shows the latest five entries inline'],
  ['Footer', 'centred, stacked credit block on this route'],
  ['Documentation mirror', 'this site keeps its own release history at /changelog'],
];

const usage = [
  'Open /changelog on the main site to read the full history — newest release first, with the version pulled out into a badge.',
  'Read the newest entry before you rely on a feature; v2.2 onwards means assets come from Bloxdy/texture-packs rather than a local folder.',
  'Follow the links inside a note — they point at the repositories involved, such as Bloxdy/code-api or Bloxdy/texture-packs.',
  'Check the Home dashboard changelog panel for the last five entries without leaving the landing screen.',
  'Track the docs site separately at /changelog here: this repository documents the main site, and its own history lives in its CHANGELOG.md.',
  'When you add a feature, write the entry the same way: version, em dash, title, then one paragraph on what changed and what it replaced.',
];

const buildNotes = [
  'Keep release notes in the same file as the page. A changelog that needs a build to read is a changelog nobody reads between releases.',
  'Parse structure out of the text, not out of data. A heading matcher plus a version badge means adding a release is one line of prose.',
  'Flatten React children before you regex them. A heading rendered as nested spans will not match a pattern that expects a string.',
  'Override anchors to add rel="noopener noreferrer". Any user-authored link in Markdown is untrusted by default.',
  'Mirror the newest entries on the dashboard. Most visitors only ever see the last five releases, and they should see them without a navigation.',
];

export default function PlatformSiteChangelogPage() {
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
          <span className="text-sm font-semibold text-[var(--text)]">Site Changelog</span>
        </div>

        <section className="mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3h8v4M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2zm2 5h8m-8 4h8m-8 4h5" /></svg>
            v1.0 → v2.3, newest first
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Site Changelog</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            The Changelog is the release-history page of the main site and it uses a single embedded Markdown string parsed
            with react-markdown for the whole timeline — so a release is a <code className={CODE_SPAN}>## v2.3 — Title</code>{' '}
            heading plus one paragraph, and the version pill, the layout, and the current-page marker are all derived from
            that text. Eleven releases sit between the initial launch and the current Players rebrand, and the newest five
            are mirrored on the Home dashboard.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Release history</h2>
          <div className="space-y-3">
            {releases.map((release) => (
              <div key={release.version} className="p-5 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl flex flex-col sm:flex-row gap-3 sm:items-start">
                <span className="inline-flex items-center justify-center shrink-0 text-xs font-black px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-500">
                  {release.version}
                </span>
                <div>
                  <h3 className="font-bold mb-1">{release.title}</h3>
                  <p className="text-sm text-[var(--text)]/70">{release.body}</p>
                </div>
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
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-sm">
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
          <h2 className="text-2xl font-bold mb-6">The heading rewrite in code</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            The whole trick is two small functions: one that flattens the rendered children back into a string, and one
            regex that splits a version from a title.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed">
{`function nodeText(node) {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (node.props && "children" in node.props) return nodeText(node.props.children);
  return "";
}

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h2: ({ node: _node, children, ...props }) => {
      const match = /^(v\\d+(?:\\.\\d+)*)\\s+[—-]\\s+(.+)$/.exec(nodeText(children));
      return (
        <h2 {...props}>
          {match ? <><span className="version-badge">{match[1]}</span><span>{match[2]}</span></> : children}
        </h2>
      );
    },
    a: ({ node: _node, children, ...props }) => (
      <a {...props} target="_blank" rel="noopener noreferrer">{children}</a>
    ),
  }}
>
  {CHANGELOG_MARKDOWN}
</ReactMarkdown>`}
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
            <a href="https://bloxdutility.netlify.app/changelog" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Main Changelog</p>
              <p className="text-sm text-[var(--text)]/60">Main site /changelog</p>
            </a>
            <a href="https://bloxdutility.netlify.app/home" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Dashboard mirror</p>
              <p className="text-sm text-[var(--text)]/60">Last five entries</p>
            </a>
            <Link href="/changelog" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Docs changelog</p>
              <p className="text-sm text-[var(--text)]/60">This site&apos;s history</p>
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
