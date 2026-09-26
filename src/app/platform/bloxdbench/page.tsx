'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CODE_SPAN = 'font-mono text-[0.8em] bg-[var(--code-bg)] border border-[var(--border)] rounded px-1.5 py-0.5 break-all';

const steps = [
  {
    title: 'Ask GitHub what exists',
    body: 'Instead of shipping a folder of textures and models, the studio asks the GitHub REST API for the repository root and builds its catalog from the answer. One directory listing call, no bundle to keep in sync.',
  },
  {
    title: 'Filter by extension',
    body: 'Models and templates are .glb and .gltf, skyboxes are .glb, .gltf, .json, and .hdr. Everything else in the repository is ignored, so the picker only ever shows things it can actually load.',
  },
  {
    title: 'Stream the bytes',
    body: 'Each entry is fetched from raw.githubusercontent.com and handed straight to the Three.js loader. Nothing is written to disk on the server and no local asset folder is read.',
  },
  {
    title: 'Edit in a voxel grid',
    body: 'The stage is a Three.js scene with an orthographic-style voxel workspace: place, erase, and paint blocks, then orbit, pan, and zoom the camera around the build while a grid overlay keeps the scale honest.',
  },
  {
    title: 'Export to Bloxd.js',
    body: 'The build is serialised as a Bloxd.js model definition and as standard GLTF. The Bloxd.js output is the one you paste into a Code Block; the GLTF output is for Blender, Unity, or anything else.',
  },
];

const tech: Array<[string, string]> = [
  ['Renderer / scene', 'Three.js (app/bloxd-bench)'],
  ['Model loading', 'GLTFLoader → .glb / .gltf'],
  ['Skybox loading', 'RGBELoader / .hdr'],
  ['Directory listing', 'https://api.github.com/repos/Bloxdy/texture-packs/contents'],
  ['Asset bytes', 'https://raw.githubusercontent.com/Bloxdy/texture-packs/main'],
  ['Texture endpoint', '/api/textures'],
  ['Model metadata', '/api/models/[name]'],
  ['Model filter', '/\\.(glb|gltf)$/i'],
  ['Skybox filter', '/\\.(glb|gltf|json|hdr)$/i'],
  ['Export target', 'Bloxd.js Code Block model definition'],
  ['Secondary export', 'GLTF for external tools'],
];

export default function PlatformBloxdBenchPage() {
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
          <span className="text-sm font-semibold text-[var(--text)]">BloxdBench</span>
        </div>

        <section className="mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>
            Three.js voxel studio — assets loaded from the internet
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">BloxdBench</h1>
          <p className="text-xl text-[var(--text)]/70 max-w-3xl">
            BloxdBench is the voxel model studio on the Players platform. It is a Three.js scene with a block grid, a
            texture and template catalog that is discovered live from the Bloxdy/texture-packs repository, and an export path
            that turns a build into Bloxd.js code you can paste straight into a Code Block.
          </p>
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
            <table className="w-full min-w-[34rem] border-collapse">
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
          <h2 className="text-2xl font-bold mb-6">Loading the catalog from GitHub</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            The listing is a single call to the contents endpoint, filtered down to files the loader understands. That is the
            whole asset pipeline — there is no local folder to keep in sync and no bundled download.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed mb-4">
{`const PACK_API = "https://api.github.com/repos/Bloxdy/texture-packs/contents";
const PACK_RAW = "https://raw.githubusercontent.com/Bloxdy/texture-packs/main";

const res = await fetch(PACK_API, { headers: { Accept: "application/vnd.github+json" } });
const entries = await res.json();

const models = entries
  .filter((e) => e.type === "file" && MODEL_EXT.test(e.name))  // /\\.(glb|gltf)$/i
  .map((e) => e.download_url ?? \`\${PACK_RAW}/\${e.name}\`);`}
          </pre>
          <p className="text-[var(--text)]/70 max-w-3xl">
            Skyboxes use the same listing with a wider filter, so <code className={CODE_SPAN}>.hdr</code> and{' '}
            <code className={CODE_SPAN}>.json</code> cubemaps show up alongside the models. Any entry the repository lists is
            immediately available in the picker — the catalog never needs a redeploy.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Export</h2>
          <p className="text-[var(--text)]/70 max-w-3xl mb-4">
            Two outputs share the same voxel data. The Bloxd.js export is the one meant for the game: it produces the model
            definition and its texture reference that a Code Block expects.
          </p>
          <pre className="bg-[var(--code-bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto font-mono text-xs leading-relaxed">
{`// Bloxd.js export — paste into a Code Block
const model = new BloxdModel("my_item");
model.setVoxels([
  [0, 0, 0], [1, 0, 0], [0, 1, 0]
]);
model.applyTexture("my_item");`}
          </pre>
          <p className="text-[var(--text)]/70 max-w-3xl mt-4">
            The GLTF export covers the same model for external work. For the game-facing side of models, read the{' '}
            <Link href="/guides/mesh-entities" className="text-[var(--primary)] hover:underline font-semibold">Mesh Entities &amp; 3D Models</Link>{' '}
            guide.
          </p>
        </section>

        <section className="border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-bold mb-6">Try it</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="https://bloxdutility.netlify.app/bloxd-bench" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Open BloxdBench</p>
              <p className="text-sm text-[var(--text)]/60">Main site /bloxd-bench</p>
            </a>
            <a href="https://github.com/Bloxdy/texture-packs" target="_blank" rel="noopener noreferrer" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">texture-packs</p>
              <p className="text-sm text-[var(--text)]/60">Asset source</p>
            </a>
            <Link href="/guides/mesh-entities" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">Mesh Entities</p>
              <p className="text-sm text-[var(--text)]/60">Use models in-world</p>
            </Link>
            <Link href="/bloxdbench" className="p-4 bg-[var(--sidebar-bg)] border border-[var(--border)] rounded-lg text-center hover:border-[var(--primary)] transition-colors">
              <p className="font-semibold">BloxdBench</p>
              <p className="text-sm text-[var(--text)]/60">Overview</p>
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
              · Models from <a href="https://github.com/Bloxdy/texture-packs" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Bloxdy/texture-packs</a>
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
