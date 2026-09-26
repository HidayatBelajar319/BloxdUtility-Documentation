'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CODE_SPAN =
  'font-mono text-[0.8em] bg-[var(--code-bg)] border border-[var(--border)] rounded px-1.5 py-0.5 break-all';

const tools = [
  { name: 'M2B Schematic Converter', href: '/tools/m2b', icon: 'fa-cube', color: 'green', desc: 'Convert Minecraft schematics to Bloxd format' },
  { name: 'Plugin Auto-Merger', href: '/tools/merger', icon: 'fa-puzzle-piece', color: 'purple', desc: 'Merge multiple plugins into one' },
  { name: 'Visual QTE Generator', href: '/tools/qte', icon: 'fa-gamepad', color: 'orange', desc: 'Create Quick Time Events visually' },
  { name: 'Particle Designer', href: '/tools/particles', icon: 'fa-sparkles', color: 'pink', desc: 'Design custom particle effects' },
  { name: 'GUI Builder', href: '/tools/gui', icon: 'fa-desktop', color: 'gold', desc: 'Build custom GUI interfaces' },
  { name: 'Texture Pack Generator', href: '/tools/texture', icon: 'fa-palette', color: 'cyan', desc: 'Generate texture packs for Bloxd' },
  { name: 'Command Studio', href: '/tools/commands', icon: 'fa-terminal', color: 'indigo', desc: 'Visual command builder' },
  { name: 'Smart Mob Maker', href: '/tools/mobs', icon: 'fa-dragon', color: 'rose', desc: 'Create custom mobs and bosses' },
];

const steps = [
  {
    title: 'One row per tool',
    body: 'Every tool is a single object in the tools array: name, href, icon, colour, and one-line description. Adding a ninth tool is adding a ninth row, not a ninth block of markup.',
  },
  {
    title: 'The grid is the array',
    body: 'The page maps over the array into a responsive grid of cards. Each card is a next/link to the tool route, so navigation, prefetching, and client transitions all come for free.',
  },
  {
    title: 'Icons are a lookup, not a package',
    body: 'getIconPath maps a Font Awesome class name to inline SVG path data, with a lightning-bolt fallback for an unknown name. The same 24×24 viewBox is used for every icon, so the grid stays visually even.',
  },
  {
    title: 'Colour is interpolated per row',
    body: 'The card tint is built as bg-{color}-500/10 and the icon takes the matching text-{color}-500, so each tool gets its own colour from one field. Hover swaps the tile background to /20 for feedback.',
  },
  {
    title: 'The page keeps the site shell',
    body: 'Header, dark-mode toggle, sticky nav, and the shared footer are the same components the rest of the site uses, so the toolbox inherits the theme and the responsive nav without any extra work.',
  },
  {
    title: 'Quick links close the loop',
    body: 'A footer grid links back to Documentation, Code Lab, BloxdBench, and Bloxd AI, so a tool that produces a script has an obvious next step instead of a dead end.',
  },
];

const tech: Array<[string, string]> = [
  ['Route', 'app/tools/page.tsx (BloxdUtilityMain)'],
  ['Route on the live site', 'https://bloxdutility.netlify.app/tools'],
  ['Tool table', '8 rows of { name, href, icon, color, desc }'],
  ['Tool routes', '/tools/m2b, /merger, /qte, /particles, /gui, /texture, /commands, /mobs'],
  ['Icon resolver', 'getIconPath(icon) → SVG path data, lightning fallback'],
  ['Colour token', 'bg-{color}-500/10 → group-hover:bg-{color}-500/20'],
  ['Card shell', 'next/link + .feature-card, hover raises a primary border'],
  ['Grid', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'],
  ['Theme', "localStorage 'darkMode' + documentElement.classList"],
  ['M2B credit', 'M2B Schematic Converter by RealSlothuLT3'],
  ['AI hook', 'Command Studio accepts CodexMind prompts and streams results over SSE'],
  ['Linked from', 'sidebar nav, Home dashboard changelog note, CodexMind AI integration'],
];

const usage = [
  'Open /tools on the main site and scan the grid — every card states in one line what it produces.',
  'Pick the tool that matches the job: a schematic to convert, plugins to merge, a QTE, a particle effect, a GUI, a texture pack, a command, or a mob.',
  'Follow the card into the tool route. Each one is a full working screen, not a sign-up form or a waitlist.',
  'Copy the generated output straight into World Code or a Code Block — every generator emits Bloxd.io-valid code rather than a generic format.',
  'For Command Studio, describe the command in plain text and let CodexMind compile it with SSE streaming into the editor.',
  'Jump back to Code Lab or BloxdBench from the quick links when the output needs modelling or an autocomplete pass.',
];

const buildNotes = [
  'Model the catalogue as data. A tools array plus a map is the whole page; a tool page is then a route, not a branch in a component.',
  'Inline the icons. A single path-data lookup keeps the bundle free of an icon library while still letting every card have its own glyph.',
  'Drive colour from the data field. Interpolating the class name from one property is enough, and it keeps hover and tile tints in sync automatically.',
  'Keep every tool reachable in one click. The grid is the product; a tool hidden behind a dropdown is a tool nobody uses.',
  'Always finish with a next step. A generator that outputs code should link to the editor, or the output dies in the clipboard.',
];

export default function PlatformDevToolsPage() {
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
          <span className="text-sm font-semibold text-[var(--text)]">Developer Tools</span>
        </div>

        <section className="mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
            Eight single-purpose generators, one grid
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Developer Tools</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            Developer Tools is a catalogue of eight Bloxd.io generators that uses a plain data table in
            app/tools/page.tsx for its routing, icons, and colours — so every tool is one row of{' '}
            <code className={CODE_SPAN}>&#123; name, href, icon, color, desc &#125;</code> and the page is nothing but the grid
            that renders it. Nothing is gated, nothing is uploaded, and every generator emits code you can paste into a
            world the same second.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The eight tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <div key={tool.name} className="p-5 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl">
                <div className={`w-10 h-10 bg-${tool.color}-500/10 rounded-lg flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconPath(tool.icon)} />
                  </svg>
                </div>
                <h3 className="font-bold mb-1">{tool.name}</h3>
                <p className="text-sm text-[var(--text)]/70">{tool.desc}</p>
                <code className={`mt-3 inline-block text-xs font-semibold px-2 py-1 rounded bg-${tool.color}-500/10 text-${tool.color}-500`}>
                  {tool.href}
                </code>
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
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-sm">
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
          <h2 className="text-2xl font-bold mb-6">The catalogue in code</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            The entire page above the footer is this array and this map. There is no per-tool component.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed mb-4">
{`const tools = [
  { name: "M2B Schematic Converter", href: "/tools/m2b",       icon: "fa-cube",        color: "green",  desc: "Convert Minecraft schematics to Bloxd format" },
  { name: "Plugin Auto-Merger",        href: "/tools/merger",     icon: "fa-puzzle-piece", color: "purple", desc: "Merge multiple plugins into one" },
  { name: "Command Studio",            href: "/tools/commands",   icon: "fa-terminal",    color: "indigo", desc: "Visual command builder" },
  // … five more rows
];

{tools.map((tool) => (
  <Link key={tool.name} href={tool.href} className="group p-6 rounded-xl border">
    <div className={\`w-12 h-12 bg-\${tool.color}-500/10 rounded-lg mb-4 group-hover:bg-\${tool.color}-500/20\`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth={2} d={getIconPath(tool.icon)} />
      </svg>
    </div>
    <h3>{tool.name}</h3>
    <p>{tool.desc}</p>
  </Link>
))}`}
          </pre>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed">
{`function getIconPath(icon) {
  const icons = {
    "fa-cube": "M8 15l3-3 3 3 3-3v6l-3 3-3-3-3 3V15z",
    "fa-terminal": "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  };
  return icons[icon] || "M13 2L3 14h9l-1 8 10-12h-9l1-8z";  // fallback
}`}
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
            <a href="https://bloxdutility.netlify.app/tools" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Developer Tools</p>
              <p className="text-sm text-[var(--text)]/60">Main site /tools</p>
            </a>
            <a href="https://bloxdutility.netlify.app/home" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Home Dashboard</p>
              <p className="text-sm text-[var(--text)]/60">Live stats &amp; search</p>
            </a>
            <Link href="/platform/code-lab" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Code Lab</p>
              <p className="text-sm text-[var(--text)]/60">Paste the output</p>
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

function getIconPath(icon: string): string {
  const icons: Record<string, string> = {
    'fa-cube': 'M8 15l3-3 3 3 3-3v6l-3 3-3-3-3 3V15z',
    'fa-puzzle-piece': 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    'fa-gamepad': 'M21 12a9 9 0 01-9 9 9.35 9.35 0 01-6.74-2.88L3 21l1.9-5.7a9.38 9.38 0 01-.87-6.72A9 9 0 1121 12z',
    'fa-sparkles': 'M5 3v4M3 5h4M12 2v4M10 4h4M19 3v4M17 5h4M21 12h-4M23 10v4M12 19v4M10 21h4M3 19v-4M5 17h4',
    'fa-desktop': 'M9 18V5l12-2v13M9 9l12 2M9 15l12 2',
    'fa-palette': 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    'fa-terminal': 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    'fa-dragon': 'M21 12a9 9 0 01-9 9 9.35 9.35 0 01-6.74-2.88L3 21l1.9-5.7a9.38 9.38 0 01-.87-6.72A9 9 0 1121 12z',
  };
  return icons[icon] || 'M13 2L3 14h9l-1 8 10-12h-9l1-8z';
}
