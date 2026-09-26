'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CODE_SPAN =
  'font-mono text-[0.8em] bg-[var(--code-bg)] border border-[var(--border)] rounded px-1.5 py-0.5 break-all';

const steps = [
  {
    title: 'Three panes share one store',
    body: 'Chat, code, and preview are separate components wired to a single Zustand store persisted to localStorage. Because the state is shared, a file created by the chat panel is the file the editor opens and the page the preview renders — no copy-paste, no save step.',
  },
  {
    title: 'The split is draggable',
    body: 'On desktop the chat column starts at 48% and a 6px handle drags it anywhere between 15% and 80%. Text selection is disabled while dragging so a resize never highlights half the page.',
  },
  {
    title: 'The right side is a deck, not a page',
    body: 'The right column toggles between Code Workspace and Live Preview. Only one is mounted at a time, so the editor and the preview never fight over scroll position or focus.',
  },
  {
    title: 'Preview is a real sandbox',
    body: 'DevicePreviewPanel compiles the workspace into a document and hands it to an iframe through srcDoc, with a loading state driven by the iframe load event. What you see is the actual output, not a mockup.',
  },
  {
    title: 'Under 1024px it becomes tabs',
    body: 'A useMediaQuery hook switches the layout at (max-width: 1024px). The two-pane split is replaced by three full-screen tabs — Chat, Code Editor, Live Preview — so a tablet never gets a 200px code column.',
  },
  {
    title: 'Chat writes into the workspace',
    body: 'The AI is allowed to create, update, rename, and delete files through explicit XML commands, and the workspace applies them immediately. Generation is not a read-only suggestion — it edits your project.',
  },
  {
    title: 'Two AI paths, one surface',
    body: 'The free provider chain runs in the browser with no key, while the server-side CodexMind route streams over SSE. The panel picks whichever is available and shows which one answered.',
  },
];

const tech: Array<[string, string]> = [
  ['Route', 'app/workspace/page.tsx → components/MainWorkspace.tsx'],
  ['Route on the live site', 'https://bloxdutility.netlify.app/workspace'],
  ['State', 'lib/store.ts — Zustand create() + persist() middleware'],
  ['Left pane', 'components/Chat/ChatPanel.tsx'],
  ['Right deck', 'components/Editor/EditorPanel.tsx'],
  ['Preview', 'components/Editor/DevicePreviewPanel.tsx — iframe srcDoc'],
  ['Breakpoint', 'useMediaQuery("(max-width: 1024px)") via hooks/use-media-query'],
  ['Default split', '48% chat, clamped to 15% – 80%'],
  ['Icons', 'lucide-react — MessageSquare, Code2, Eye, Sparkles'],
  ['Free AI path', 'lib/free-ai.ts — Puter.js, then BYOK keys'],
  ['Server AI path', 'app/api/chat/route.ts — text/event-stream, ReadableStream'],
  ['Server prompts', 'lib/prompts.ts — CodexMindPrompt, MindChatPrompt, AgentMindPrompt'],
  ['File commands', 'create_file / rename_file / delete_file XML commands'],
  ['Sync route', 'app/api/sync/route.ts'],
  ['Models route', 'app/api/models/[name]/route.ts'],
  ['Export route', 'app/api/export-workspace/route.ts — full source ZIP'],
  ['Key storage', 'Keys live outside the store: bloxd.free-ai.keys.v1'],
];

const usage = [
  'Open /workspace on the main site. On a desktop you get chat on the left and the code/preview deck on the right; on a tablet you get the three tabs.',
  'Describe what you want in the chat panel — a landing page, a game mechanic, a small tool — and let the AI generate it.',
  'Watch the file appear in the Code Workspace tab. Read it, change it, rename it; ask for an edit and the change is applied to the same file.',
  'Switch to Live Preview to run the compiled result in a real iframe sandbox, and back to the code whenever you want to keep working.',
  'Drag the divider to give the chat more room while you prompt heavily, and more room to the code once you are editing.',
  'Export the whole workspace as a source ZIP when the project is worth keeping.',
];

const buildNotes = [
  'Put shared state in one store and persist it. Chat, editor, and preview are three views of the same project, so a single store is what makes the panes agree.',
  'Keep API keys out of the persisted store. The store is written to localStorage; keys get their own entry so they can be cleared without touching the project.',
  'Preview with srcDoc, not a blob URL or a dev server. An iframe with srcDoc is a real sandbox, needs no backend, and cannot touch your origin.',
  'Detect the viewport in JS, not only in CSS. The split layout is not a CSS problem — mounting different components is, so switch components at 1024px.',
  'Clamp the drag. Without a min and max, a dragged divider can make a pane unusable and the user cannot drag it back.',
];

export default function PlatformAiWorkspacePage() {
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
          <span className="text-sm font-semibold text-[var(--text)]">AI Workspace</span>
        </div>

        <section className="mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            Prompt, edit, and preview in one surface
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">AI Workspace</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            The AI Workspace is the main site&apos;s three-pane build surface and it uses a persisted Zustand store for state
            plus the shared provider chain in lib/free-ai.ts for chat — so a prompt typed in the chat panel becomes a real
            file in the editor and a running page in the preview without a save, an export, or a page reload. Under 1024px
            the split layout is replaced by three full-screen tabs, which is why it is usable on a tablet as well as a
            desktop.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The three panes</h2>
          <div className="space-y-4">
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl border-l-4 border-l-emerald-500">
              <h3 className="text-lg font-bold mb-1">Chat</h3>
              <p className="text-[var(--text)]/70">
                The left column and the first mobile tab. It runs the free provider chain first — Puter.js with no key, then
                your own OpenRouter or Groq key — and falls back to the server-side CodexMind route streamed over SSE. The
                reply is written into the workspace instead of into a read-only transcript.
              </p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl border-l-4 border-l-blue-500">
              <h3 className="text-lg font-bold mb-1">Code Workspace</h3>
              <p className="text-[var(--text)]/70">
                The editor tab. It holds the file list for the project, opens whichever file the AI last created or edited,
                and persists everything through the store so a reload lands you back on the same file.
              </p>
            </div>
            <div className="p-6 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-xl border-l-4 border-l-purple-500">
              <h3 className="text-lg font-bold mb-1">Live Preview</h3>
              <p className="text-[var(--text)]/70">
                The third pane compiles the workspace into a single document and renders it in a sandboxed iframe via
                srcDoc, with a loading state tied to the iframe load event. Errors show up where the code actually runs,
                which is faster than reading a stack trace from the editor.
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
          <h2 className="text-2xl font-bold mb-6">The layout in code</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            The desktop split and the mobile tab set are the same three components behind one breakpoint check. That single
            hook is the whole responsive story.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed mb-4">
{`const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
const [chatWidth, setChatWidth] = useState(48);   // percent

if (isTabletOrMobile) {
  return <Tabs>{activeTab === "chat" && <ChatPanel />}
                  {activeTab === "code" && <EditorPanel />}
                  {activeTab === "preview" && <DevicePreviewPanel />}</Tabs>;
}

return (
  <div ref={containerRef}>
    <div style={{ width: chatWidth + "%" }}><ChatPanel /></div>
    <div onMouseDown={() => setIsDragging(true)} />        {/* divider */}
    <div style={{ width: 100 - chatWidth + "%" }}>
      {rightPanelTab === "code" ? <EditorPanel /> : <DevicePreviewPanel />}
    </div>
  </div>
);

// during a drag, text selection is disabled so a resize does not highlight the page
document.body.style.userSelect = isDragging ? "none" : "";`}
          </pre>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed">
{`// the AI edits the project with explicit commands, not with prose
<command type="create_file" name="main.js">file contents</command>
<command type="rename_file" name="old.js" new_name="new.js"></command>
<command type="delete_file" name="target.js"></command>

// preview: a real sandbox, no dev server
<iframe srcDoc={compiledCodeContent} onLoad={() => setIframeLoaded(true)} />`}
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
            <a href="https://bloxdutility.netlify.app/workspace" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">AI Workspace</p>
              <p className="text-sm text-[var(--text)]/60">Main site /workspace</p>
            </a>
            <a href="https://bloxdutility.netlify.app/bloxd-ai" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Bloxd AI</p>
              <p className="text-sm text-[var(--text)]/60">Chat only</p>
            </a>
            <Link href="/ai" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Chat here</p>
              <p className="text-sm text-[var(--text)]/60">Live on this site</p>
            </Link>
            <Link href="/platform/ai" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Free AI internals</p>
              <p className="text-sm text-[var(--text)]/60">The provider chain</p>
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
