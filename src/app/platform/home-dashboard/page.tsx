'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CODE_SPAN =
  'font-mono text-[0.8em] bg-[var(--code-bg)] border border-[var(--border)] rounded px-1.5 py-0.5 break-all';

const steps = [
  {
    title: 'Discover the file list',
    body: 'The page calls the GitHub contents endpoint for Bloxdy/code-api and keeps every .md and .txt file. If GitHub is rate-limited or offline it falls back to a hardcoded list of the same 14 files, so the dashboard always renders.',
  },
  {
    title: 'Fetch the raw data',
    body: 'Each discovered file is fetched in parallel from raw.githubusercontent.com. API_REFERENCE.md is JSON-parsed into a function map, BLOCK_NAMES.txt and ITEM_NAMES.txt are split on newlines, and the callback total is read from CALLBACKS.md.',
  },
  {
    title: 'Publish the live counts',
    body: 'Function, block, item, and callback totals are written into the stat cards and animate up to their target over about 1.2 seconds. The sidebar mirrors the same three numbers, and a dash is shown when a fetch has not landed yet.',
  },
  {
    title: 'Rotate the tip',
    body: 'Twelve hand-written Bloxd.io tips live in one array. A 8-second interval advances the current tip, and Prev / Next step through the array manually with an index counter. Each tip may carry a short code sample that is shown under the text.',
  },
  {
    title: 'Search blocks and items',
    body: 'Typing filters the combined block and item pool on a case-insensitive substring, de-duplicates by name so a block and an item of the same name appear once, caps the visible set at 20, and shows the total match count underneath.',
  },
  {
    title: 'Shuffle the function spotlight',
    body: 'The spotlight picks a random entry from the parsed function map and shows its name, description, and example. Shuffle rolls again, which is the fastest way to rediscover an API you have not touched in a while.',
  },
  {
    title: 'Build the mega-prompt',
    body: 'Every discovered documentation file is concatenated into a single system prompt that starts with "Act as a Bloxd.io Developer Assistant". The sync chip in the top bar moves from SYNCING to Synced, or to Offline Mode if the build fails.',
  },
  {
    title: 'Copy and hand it to any LLM',
    body: 'One click copies the whole prompt to the clipboard and pops a toast. Paste it into ChatGPT, Claude, or any other model and the answer is grounded in the official Bloxd.io API instead of guesses.',
  },
];

const tech: Array<[string, string]> = [
  ['Route', 'app/home/page.tsx (BloxdUtilityMain)'],
  ['Route on the live site', 'https://bloxdutility.netlify.app/home'],
  ['Framework', 'Next.js 15 App Router, client component'],
  ['Discovery call', 'GET https://api.github.com/repos/Bloxdy/code-api/contents'],
  ['Raw base', 'https://raw.githubusercontent.com/Bloxdy/code-api/main/'],
  ['Fallback list', 'FALLBACK_FILES — the same 14 .md / .txt names'],
  ['Function data', 'API_REFERENCE.md → JSON.parse → functions map'],
  ['Block IDs', 'BLOCK_NAMES.txt → split on newline, comments dropped'],
  ['Item IDs', 'ITEM_NAMES.txt → split on newline, comments dropped'],
  ['Callback count', 'CALLBACKS.md → 117 entries'],
  ['Tip rotation', 'setInterval(nextTip, 8000) over a 12-item array'],
  ['Search cap', '20 results, de-duplicated by name, substring match'],
  ['Count animation', 'animateCount() over ~1200 ms'],
  ['Theme', "localStorage 'darkMode' + documentElement.classList"],
  ['Shortcuts table', 'F8, right-click, Escape, E, Space + Shift, Z, F12'],
  ['Source export', 'app/api/export-workspace/route.ts — full source ZIP'],
  ['Styling', 'globals.css custom properties + Font Awesome icons'],
];

const usage = [
  'Open /home on the main site and wait for the sync chip to read Synced — every panel is fed by that one fetch.',
  'Read the four stat cards: API functions, block types, item types, and callbacks, as published by the official repository right now.',
  'Type in Item & Block Lookup to search names, switch the filter between All, Blocks, and Items, then click a result tag to copy that exact string into your script.',
  'Hit Shuffle on Function Spotlight until you find a function you have not used, then copy its example into World Code.',
  'Step through the tip carousel with Next and Prev to pick up a Bloxd.io rule you keep breaking — the globalThis rule and the no line-comments rule are the two that save the most time.',
  'Click Copy System Prompt, open your favourite LLM, and paste it once to turn it into a grounded Bloxd.io assistant.',
];

const buildNotes = [
  'Put every stat behind one guarded discovery call. A try/catch that returns a hardcoded file list is the difference between a dashboard that works offline and one that shows a wall of dashes.',
  'Parse the same text files the editor already uses. There is no reason to maintain a second copy of the API surface, and searching the raw lists is cheaper than shipping JSON.',
  'Keep the tip array and the spotlight in plain state. A rotating value is a setInterval over an index, not a component library.',
  'De-duplicate and cap search results. Without it a query such as "stone" paints hundreds of tags and the panel becomes unusable on a phone.',
  'Version the mega-prompt. It is a build artefact assembled at runtime, so it always matches the repository instead of drifting from it.',
];

export default function PlatformHomeDashboardPage() {
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
          <span className="text-sm font-semibold text-[var(--text)]">Home Dashboard</span>
        </div>

        <section className="mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l4-4m0 8l-4-4m18 0l-4 4m0-8l4 4M14 3l-1 18m-4-18l1 18" /></svg>
            Live numbers, straight from the official repository
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Home Dashboard</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            The Home Dashboard is the landing screen of the main site and the first thing you see after the logo. It is a
            live developer console for Bloxd.io that uses the GitHub contents API and raw file fetches against
            Bloxdy/code-api for its API-function, block, item, and callback counts — so the numbers on the page are the
            numbers the official repository publishes today, not a snapshot someone remembered to update. The same fetch
            powers the search box, the function spotlight, and the mega-prompt builder.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">What sits on the dashboard</h2>
          <div className="space-y-4">
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl border-l-4 border-l-blue-500">
              <h3 className="text-lg font-bold mb-1">Live API stats</h3>
              <p className="text-[var(--text)]/70">
                Four animated stat cards — API functions, block types, item types, and callbacks — counted from the raw
                documentation files. The sidebar repeats the first three so the numbers are visible from any scroll
                position.
              </p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl border-l-4 border-l-green-500">
              <h3 className="text-lg font-bold mb-1">Item &amp; block lookup</h3>
              <p className="text-[var(--text)]/70">
                A search field with an All / Blocks / Items filter. Matching names render as clickable tags that copy the
                exact string, which is the form every Bloxd.io script expects.
              </p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl border-l-4 border-l-purple-500">
              <h3 className="text-lg font-bold mb-1">Function spotlight &amp; tips</h3>
              <p className="text-[var(--text)]/70">
                A random API function with its description and example, reshuffled on demand, next to a rotating carousel of
                twelve Bloxd.io rules — the globalThis sharing rule, the no line-comments rule, the tick budget, and the
                16,000 character and 500 line Code Block limits.
              </p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl border-l-4 border-l-yellow-500">
              <h3 className="text-lg font-bold mb-1">Mega-prompt builder</h3>
              <p className="text-[var(--text)]/70">
                Every discovered documentation file is concatenated into one system prompt with a
                <code className={CODE_SPAN}>[FILE: name]</code> header per document, ready to paste into any LLM. A sync chip
                in the top bar shows whether the prompt is live, synced, or offline.
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
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-sm">
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
          <h2 className="text-2xl font-bold mb-6">The discovery in code</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            One guarded discovery call, one parallel fetch, one parser per file type. The fallback is what keeps the page
            alive when GitHub is unreachable.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed mb-4">
{`const GITHUB_BASE = "https://raw.githubusercontent.com/Bloxdy/code-api/main/";

async function fetchDiscovery() {
  try {
    const res = await fetch("https://api.github.com/repos/Bloxdy/code-api/contents");
    if (!res.ok) throw new Error("GitHub API responded with " + res.status);
    const data = await res.json();
    const files = data
      .filter((f) => f.type === "file" && /\\.(md|txt)$/.test(f.name))
      .map((f) => f.name);
    if (files.length === 0) throw new Error("No documentation files discovered");
    return files;
  } catch (e) {
    return FALLBACK_FILES;              // same 14 names, hardcoded once
  }
}`}
          </pre>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed">
{`const results = await Promise.all(files.map((file) =>
  fetch(GITHUB_BASE + file).then((res) => res.text())
));

const functions = JSON.parse(results[0]);            // API_REFERENCE.md
const blocks   = text(results[1]).split("\\n").filter(Boolean);
const items    = text(results[2]).split("\\n").filter(Boolean);

// mega-prompt: one document set, one string
let prompt = "Act as a Bloxd.io Developer Assistant.\\n\\n--- API DOCUMENTATION ---\\n";
results.forEach((t, i) => { prompt += "[FILE: " + files[i] + "]\\n" + t + "\\n"; });`}
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
            <a href="https://bloxdutility.netlify.app/home" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Home Dashboard</p>
              <p className="text-sm text-[var(--text)]/60">Main site /home</p>
            </a>
            <a href="https://bloxdutility.netlify.app/tools" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Developer Tools</p>
              <p className="text-sm text-[var(--text)]/60">Eight generators</p>
            </a>
            <Link href="/platform/data" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Data pipeline</p>
              <p className="text-sm text-[var(--text)]/60">What it reads</p>
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
